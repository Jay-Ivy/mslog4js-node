/**
 * Created by jie.ding on 2016/4/26.
 */
var path = require('path');
var log4js = require('../lib/main');
var logPath = '../logs',
    logType = 'typePortLog',
    logLevel = 'INFO',
    logMask = true;
//log4js.configure({
//    appenders: [
//        {
//            type: 'console',
//            category: "console"
//        }, // 控制台输出
//        {
//            type: 'file',
//            category: 'fileLog',
//            filename: path.join(logPath, 'log.log'),
//            maxLogSize: 104857600,
//            backups: 100
//        } , // 单文件输出
//        {
//            type: "dateFile",
//            category: 'dateFileLog',
//            filename: path.join(logPath, 'log'),
//            pattern: "-yyyyMMdd.log",
//            alwaysIncludePattern: true
//        } // 日期格式文件输出
//    ],
//    replaceConsole: true,   //替换console.log
//    levels: {
//        console: 'ALL',
//        fileLog: 'ALL',
//        dateFileLog: 'ALL'
//    }
//});
//
//var logger = log4js.getLogger(logType || 'dateFileLog');
//// 设置日志级别
//logger.setLevel(logLevel.toUpperCase());
//logger.setMask(logMask);
//exports.logger = logger;
//exports.use = function (app) {
//    app.use(log4js.connectLogger(logger, {level: 'info', format: ':remote-addr - - ":method :url HTTP/:http-version" :status :response-timems', mask: logMask}));
//};
var logger = log4js.use({use: function() {}}, {
    port: 8888,
    path: logPath,
    type: logType,
    level: logLevel,
    mask: logMask
});

let Mask = logger.Mask;
var rules = {};
rules[Mask.type.HIDDEN] = {
    fields: ['smsType']
};
Mask.addRules(rules);

logger.info({"mobile":"18900000000","smsType":"LOGIN"});

