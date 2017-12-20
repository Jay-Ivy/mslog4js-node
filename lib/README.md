```javascript
1、添加依赖：
"mslog4js": "^1.2.1"

2、引入日志：
let mslog4js = require('mslog4js');
 
3、创建日志实例
第一种（推荐）：
let logger = mslog4js.use(app, {
    port: '8080', // 支持按端口输出日志文件，默认process.env.NODE_PORT
    path: '/home/finance/Logs/www.jay.com', // 日志存储路径，默认process.env.LOG_PATH
    level: 'debug', // 日志输入类型：all(默认值)、debug、info、warn、error、fatal
    type: 'portFileLog', // 日志打印类型：console(默认值)、typeLog(依赖level)、typePortLog(依赖level)、fileLog、filePortLog、dateFileLog、dateFilePortLog
    fileMaxSize: 2147483648, // 单文件最大容量，type为fileLog或portFileLog时有效，默认2147483648
    fileBackups: 100, // 备份文件最大份数，默认100
    appender: { // 日志配置项，若配置此自定义项，上面的参数均可不配置，此配置项具体值请参考log4js的API说明
        type: 'file', // 日志类型，取值：console、file、dateFile
        category: 'filePort',
        filename: '/home/finance/Logs/www.jay.com/demo.log',
        maxLogSize: 1024,
        backups: 3
    },
    mask: false, // 是否脱敏关键信息，默认false
    connectFormat: ':remote-addr - - ":method :url HTTP/:http-version" :status :response-timems' // 路由请求日志格式化信息，默认':remote-addr - - ":method :url HTTP/:http-version" :status :response-timems'
});
第二种（自定义日志类别）：
mslog4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
         }, // 控制台输出
         {
            type: 'file',
            category: 'fileLog',
            filename: path.join(logPath, 'log.log'),
            maxLogSize: 104857600,
            backups: 100
         } , // 单文件输出
         {
            type: "dateFile",
            category: 'dateFileLog',
            filename: path.join(logPath, 'log'),
            pattern: "-yyyyMMdd.log",
            alwaysIncludePattern: true
         } // 日期格式文件输出
     ],
    replaceConsole: true, //替换console.log
    levels: {
        console: 'ALL',
        fileLog: 'ALL',
        dateFileLog: 'ALL'
    }
});
let logger = mslog4js.getLogger('dateFileLog');
// 设置日志级别
logger.setLevel('INFO');
logger.setMask(true);
app.use(mslog4js.connectLogger(logger, {level: 'info', format: ':remote-addr - - ":method :url HTTP/:http-version" :status :response-timems', mask: logMask}));
 
4、设置脱敏规则/字段
let Mask = logger.Mask;
 
// 添加单个规则
Mask.addRule(Mask.type.ADDRESS, ['detail', 'address', ...]);
Mask.addRule('自定义规则', ['customField', ...], function(value) {
    // 脱敏处理...
    return value;
});
 
// 批量添加脱敏规则
var rules = {};
rules[Mask.type.NAME] = {
    fields: ['userName']
};
rules[Mask.type.ADDRESS] = {
    fields: ['detail']
};
Mask.addRules(rules);
 
 
默认规则Mask.type包括：
NAME（名字）——用**替换，留最后一个字
HIDDEN（隐藏项）——不输出，输出为********
ID_CARD（机动车驾驶证/身份证号）——18位，只显示前2位和4位尾号 如：63************2721
BANK_CARD（银行卡号）——只显示6位尾号，如：*************891356
MOBILE_PHONE（手机号）——11位，只显示前3位和4位尾号 如：187*****4970
FIXED_PHONE（座机号）——只显示4位尾号 如：*****4970
EMAIL（邮箱）——@前半部分只显示首位 如：t**@qq.com
ADDRESS（地址）——只到省级或直辖市，如：重庆市大渡口区***********
 
各规则对应默认字段名：
NAME：['name']
HIDDEN: ['password']
ID_CARD: ['idCard', 'idCardNo']
BANK_CARD: ['bankCard', 'bankCardNo']
MOBILE_PHONE: ['mobile', 'mobilePhone']
FIXED_PHONE: ['telphone', 'telephone']
EMAIL: ['email']
ADDRESS: ['address']
 
/**
 * 添加脱敏规则
 * @param rule String 规则名称
 * @param fields Array|String 规则对应JSON对象字段名
 * @param handle Function 脱敏处理机[可选]，此字段可以重写默认脱敏规则
*/
Mask.addRule(rule, fields, handle);
 
/**
 * 批量添加脱敏规则
 * @param rules
 *     {
 *         Mask.type.NAME: {fields: [], handle: {}},
 *         Mask.type.ADDRESS: {fields: [], handle: {}}
 *     }
*/
Mask.addRules(rules);
```