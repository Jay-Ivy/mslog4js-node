/**
 * Created by jie.ding on 2017/7/20.
 */

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
    PASSWORD: 'password',
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
 * @param rule      规则名称
 * @param field     规则对应JSON对象字段名
 * @param handle    脱敏处理机
 */
const addRule = (rule, field, handle) => {
    let _field = MASK.FIELD[rule] || [];
    MASK.FIELD[rule] = _field.concat(isArray(field) ? field : [field]);
    if (isFunction(handle)) {
        MASK.ENCRYPT[rule] = handle;
    }
};

/**
 * 脱敏规则扫描处理器
 * @param key
 * @param value
 */
const scan = (key, value) => {
    for (var type in MASK.FIELD) {
        if (MASK.FIELD[type].indexOf(key) > -1) {
            return MASK.ENCRYPT[type](value);
        }
    }
    return value;
};

/**
 * 脱敏通用处理器
 * @param json
 */
const encryptHandle = (json) => {
    if (isPlainObject(json)) {
        for (var key in json) {
            if (isPlainObject(json[key])) {
                encryptHandle(json[key]);
            } else {
                json[key] = scan(key, json[key]);
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
    if (typeof data === 'string' && /\{([\w\W]*)\}/.test(data)){
        stringToJSON = true;
        data = JSON.parse(data || '{}');
    }
    var json = data;
    if (isPlainObject(data)) {
        json = Object.assign({}, data);
        encryptHandle(json);
    }

    return stringToJSON ? JSON.stringify(json) : json;
};

/********** 注册脱敏规则 ***********/

/**
 * 名称：用**替换，留最后一个字
 */
addRule(TYPE.NAME, ['name'], function(value) {
    if (/^([\w\W]+)([\w\W]{1})$/.test(value)) {
        return replace(RegExp.$1.length) + RegExp.$2;
    }
    return value;
});
/**
 * 隐藏项，不输出，输出为********
 */
addRule(TYPE.HIDDEN, ['password'], function(value) {
    return '****';
});
/**
 * 密码：不输出，输出为*******
 */
addRule(TYPE.PASSWORD, ['password'], function(value) {
    return '********';
});
/**
 * 机动车驾驶证/身份证号：18位，只显示4位尾号   如：63************2721
 */
addRule(TYPE.ID_CARD, ['idCard'], function(value) {
    if (/^([\d]{2})([\d]+)([\d]{3})([\d|x]{1})$/i.test(value)) {
        return RegExp.$1 + replace(RegExp.$2.length) + RegExp.$3 + RegExp.$4;
    }
    return value;
});
/**
 * 银行卡号：只显示6位尾号
 */
addRule(TYPE.BANK_CARD, ['bankCard', 'bankCardNo'], function(value) {
    if (/^([\d]+)([\d]{6})$/.test(value)) {
        return replace(RegExp.$1.length) + RegExp.$2;
    }
    return value;
});
/**
 * 手机号：11位，只显示4位尾号  如：187*****4970
 */
addRule(TYPE.MOBILE_PHONE, ['mobile'], function(value) {
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
addRule(TYPE.EMAIL, ['email'], function(value) {
    if (/^([\w\W]{1})([^@]+)([\w\W]+)$/.test(value)) {
        return RegExp.$1 + replace(RegExp.$2.length) + RegExp.$3;
    }
    return value;
});
/**
 * 地址：只到省级或直辖市
 */
addRule(TYPE.ADDRESS, ['address'], function(value) {
    if (/^([^省市]{1,4})?([省市]{1})?([^市区]{1,4})([市区]{1})([\w\W]*)$/.test(value)) {
        return RegExp.$1 + RegExp.$2 + RegExp.$3 + RegExp.$4 + replace(RegExp.$5.length);
    }
    return value;
});

exports.type = TYPE;
exports.addRule = addRule;
exports.encrypt = encrypt;