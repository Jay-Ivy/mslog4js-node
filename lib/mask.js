"use strict";
/**
 * Created by jie.ding on 2017/7/20.
 */
let querystring = require('querystring');
const replace = (length, char) => {
    var str = '';
    while (length--) {
        str += char || '*';
    }
    return str;
};

// 对象合并，继承
const hasOwn = Object.prototype.hasOwnProperty;
const toStr = Object.prototype.toString;
const isFunction = (fn) => {
    return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
};
const isArray = (arr) => {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
    }
    return toStr.call(arr) === '[object Array]';
};
const isPlainObject = (obj) => {
    if (!obj || toStr.call(obj) !== '[object Object]') {
        return false;
    }

    let hasOwnConstructor = hasOwn.call(obj, 'constructor');
    let hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
    // Not own constructor property must be Object
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
    }
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    let key;
    for (key in obj) {/**/}
    return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// 默认类型
let TYPE = {
    NAME: 'name',
    HIDDEN: 'hidden',
    ID_CARD: 'idCard',
    BANK_CARD: 'bankCard',
    MOBILE_PHONE: 'mobilePhone',
    FIXED_PHONE: 'fixedPhone',
    EMAIL: 'email',
    ADDRESS: 'address'
};

// 脱敏规则
let MASK = {
    FIELD: {},
    ENCRYPT: {}
};

/**
 * 添加脱敏规则
 * @param rule    String        规则名称
 * @param fields  Array|String  规则对应JSON对象字段名
 * @param handle  Function      脱敏处理机
 */
const addRule = (rule, fields, handle) => {
    let _field = MASK.FIELD[rule] || [];
    MASK.FIELD[rule] = _field.concat(isArray(fields) ? fields : [fields]);
    if (isFunction(handle)) {
        MASK.ENCRYPT[rule] = handle;
    }
};

/**
 * 批量添加脱敏规则
 * @param rules
 *              {
 *                  name: {fields: [], handle: {}},
 *                  address: {fields: [], handle: {}}
 *              }
 */
const addRules = (rules) => {
    for (var key in rules) {
        var rule = [key, rules[key].fields || [], rules[key].handle];
        addRule.apply(this, rule);
    }
};

/**
 * 脱敏规则扫描处理器
 * @param key
 * @param value
 */
const scan = (key, value) => {
    try {
        for (var type in MASK.FIELD) {
            if (new RegExp('(^|,)' + key + '(,|$)', 'i').test(MASK.FIELD[type].join(','))) {
                var encryptValue = (value || '') + '';
                if (MASK.ENCRYPT.hasOwnProperty(type) && isFunction(MASK.ENCRYPT[type])) {
                    encryptValue = MASK.ENCRYPT[type](encryptValue);
                }
                value = encryptValue;
                break;
            }
        }
    } finally {
        return value;
    }
};

/**
 * 脱敏通用处理器
 * @param json
 */
const encryptHandle = (json) => {
    if (isArray(json)) {
        json.forEach((value, index) => {
            encryptHandle(value);
        });
    } else if (isPlainObject(json)) {
        for (var key in json) {
            let data = json[key];
            if (isArray(data)) {
                data.map((value, index, array) => {
                    encryptHandle(value);
                });
            } else if (isPlainObject(data)) {
                encryptHandle(data);
            } else {
                json[key] = scan(key, data);
            }
        }
    }
};

/**
 * 脱敏数据
 * @param data 仅支持JSON对象或JSON字符串
 */
const encrypt = (data) => {
    var stringToJSON = false;
    if (typeof data === 'string' && /(^\{([\w\W]*)\}$)|(^\[([\w\W]*)\]$)/.test(data)){
        stringToJSON = true;
        data = JSON.parse(data || '{}');
    }
    var json = data;
    if (isArray(data)) {
        encryptHandle(json);
    } else if (isPlainObject(data)) {
        json = JSON.parse(JSON.stringify(data));
        encryptHandle(json);
    }

    return stringToJSON ? JSON.stringify(json) : json;
};

/********** 注册脱敏规则 ***********/

/**
 * 名称：用**替换，留最后一个字
 */
addRule(TYPE.NAME, ['name'], function(value) {
    if (/^([\w\W]{1})([\w\W]+)([\w\W]{1})$/.test(value)) {
        return RegExp.$1 + replace(RegExp.$2.length) + RegExp.$3;
    } else if (value.length == 2) {
        return replace(1) + value.charAt(1);
    }
    return value;
});
/**
 * 隐藏项，不输出，输出为********
 */
addRule(TYPE.HIDDEN, ['password', 'pwd'], function(value) {
    return '********';
});
/**
 * 机动车驾驶证/身份证号：18位，只显示4位尾号   如：63************2721
 */
addRule(TYPE.ID_CARD, ['idCard', 'idNo', 'idCardNo', 'ident', 'identNo', 'idNumber'], function(value) {
    if (/^([\d]{2})([\d]+)([\d]{3})([\d|x]{1})$/i.test(value)) {
        return RegExp.$1 + replace(RegExp.$2.length) + RegExp.$3 + RegExp.$4;
    }
    return value;
});
/**
 * 银行卡号：只显示6位尾号
 */
addRule(TYPE.BANK_CARD, ['bankCard', 'bankCardNo'], function(value) {
    if (/^([\d]{6})([\d]+)([\d]{4})$/.test(value)) {
        return RegExp.$1 + replace(RegExp.$2.length) + RegExp.$3;
    }
    return value;
});
/**
 * 手机号：11位，只显示4位尾号  如：187*****4970
 */
addRule(TYPE.MOBILE_PHONE, ['mobile', 'mobilePhone', 'cellphone', 'phone'], function(value) {
    if (/^1([\d]{2})([\d]{4})([\d]{4})$/.test(value)) {
        return '1' + RegExp.$1 + replace(RegExp.$2.length) + RegExp.$3;
    }
    return value;
});
/**
 * 座机号：只显示4位尾号  如：*****4970
 */
addRule(TYPE.FIXED_PHONE, ['telphone', 'telephone'], function(value) {
    if (/^([\d\-\(\)]+)([\d]{4})$/.test(value)) {
        return replace(RegExp.$1.length) + RegExp.$2;
    }
    return value;
});
/**
 * 邮箱：@前半部分隐藏   如：**@sina.com
 */
addRule(TYPE.EMAIL, ['email', 'emailAddress'], function(value) {
    if (/^([\w\W]{1})([^@]+)([\w\W]+)$/.test(value)) {
        return RegExp.$1 + replace(RegExp.$2.length) + RegExp.$3;
    }
    return value;
});
/**
 * 地址：只到省级或直辖市
 */
addRule(TYPE.ADDRESS, ['address'], function(value) {
    if (/^(重庆|北京|上海|天津)(市)?([^区县]+[区县]{1})([\w\W]*)$/.test(value)) { // 直辖市
        return RegExp.$1 + RegExp.$2 + RegExp.$3 + replace(RegExp.$4.length);
    } else if (/^([\u4E00-\u9FA5]+自治区[^市州区]+[市州区])([\w\W]*)$/.test(value)) { // 自治区
        return RegExp.$1 + replace(RegExp.$2.length);
    } else if (/^([^省]{2,4})(省)?([^市]+市)([\w\W]*)$/.test(value)) { // 省市
        return RegExp.$1 + RegExp.$2 + RegExp.$3 + replace(RegExp.$4.length);
    } else {
        return value;
    }
});

exports.type = TYPE;
exports.addRule = addRule;
exports.addRules = addRules;
exports.encrypt = encrypt;