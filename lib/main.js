"use strict";
/**
 * Created by jie.ding on 2017/7/20.
 */
let path = require('path'),
    log4js = require('./log4js'),
    _ = require('lodash'),
    defaultOpts = {
        port: process.env.NODE_PORT || 'none',
        path: process.env.LOG_PATH || './',
        type: 'console',
        level: 'all',
        mask: false,
        fileMaxSize: 2147483648,
        fileBackups: 100,
        connectFormat: ':remote-addr - - ":method :url HTTP/:http-version" :status :response-timems'
    };

log4js.use = function (app, opts) {
    opts = _.extend(defaultOpts, opts || {});

    let logPath = opts.path,
        logType = opts.type,
        logLevel = opts.level.toUpperCase(),
        logMask = opts.mask,
        appender = opts.appender,
        appenders = appender ? [appender] : [
            {
                type: 'console',
                category: 'console'
            }, // 控制台输出
            {
                type: 'file',
                category: 'traceLog',
                typeLog: true,
                filename: path.join(logPath, 'trace.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // trace类型文件输出
            {
                type: 'file',
                category: 'tracePortLog',
                typePortLog: true,
                filename: path.join(logPath, 'trace.' + opts.port + '.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // trace类型文件带端口输出
            {
                type: 'file',
                category: 'debugLog',
                typeLog: true,
                filename: path.join(logPath, 'debug.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // debug类型文件输出
            {
                type: 'file',
                category: 'debugPortLog',
                typePortLog: true,
                filename: path.join(logPath, 'debug.' + opts.port + '.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // debug类型文件带端口输出
            {
                type: 'file',
                category: 'infoLog',
                typeLog: true,
                filename: path.join(logPath, 'info.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // info类型文件输出
            {
                type: 'file',
                category: 'infoPortLog',
                typePortLog: true,
                filename: path.join(logPath, 'info.' + opts.port + '.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // info类型文件带端口输出
            {
                type: 'file',
                category: 'warnLog',
                typeLog: true,
                filename: path.join(logPath, 'warn.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // warn类型文件输出
            {
                type: 'file',
                category: 'warnPortLog',
                typePortLog: true,
                filename: path.join(logPath, 'warn.' + opts.port + '.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // warn类型文件带端口输出
            {
                type: 'file',
                category: 'errorLog',
                typeLog: true,
                filename: path.join(logPath, 'error.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // error类型文件输出
            {
                type: 'file',
                category: 'errorPortLog',
                typePortLog: true,
                filename: path.join(logPath, 'error.' + opts.port + '.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // error类型文件带端口输出
            {
                type: 'file',
                category: 'fatalLog',
                typeLog: true,
                filename: path.join(logPath, 'fatal.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // fatal类型文件输出
            {
                type: 'file',
                category: 'fatalPortLog',
                typePortLog: true,
                filename: path.join(logPath, 'fatal.' + opts.port + '.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // fatal类型文件带端口输出
            {
                type: 'file',
                category: 'fileLog',
                filename: path.join(logPath, 'all.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // 单文件输出
            {
                type: 'file',
                category: 'filePortLog',
                filename: path.join(logPath, 'all.' + opts.port + '.log'),
                maxLogSize: opts.fileMaxSize,
                backups: opts.fileBackups
            }, // 单文件带端口输出
            {
                type: 'dateFile',
                category: 'dateFileLog',
                filename: path.join(logPath, 'date'),
                pattern: '.yyyyMMdd.log',
                alwaysIncludePattern: true
            }, // 日期格式文件输出
            {
                type: 'dateFile',
                category: 'dateFilePortLog',
                filename: path.join(logPath, 'date'),
                pattern: '.yyyyMMdd.' + opts.port + '.log',
                alwaysIncludePattern: true
            } // 日期格式文件单端口输出
        ].filter(function(data) {
                return data.category == logType || data[logType];
            });

    // 日志配置
    let config = {
        appenders: appenders,
        replaceConsole: true,   //替换console.log
        levels: {
            console: 'ALL',
            debugLog: 'ALL',
            debugPortLog: 'ALL',
            infoLog: 'ALL',
            infoPortLog: 'ALL',
            warnLog: 'ALL',
            warnPortLog: 'ALL',
            errorLog: 'ALL',
            errorPortLog: 'ALL',
            fatalLog: 'ALL',
            fatalPortLog: 'ALL',
            fileLog: 'ALL',
            filePortLog: 'ALL',
            dateFileLog: 'ALL',
            dateFilePortLog: 'ALL'
        }
    };

    if (appenders.length) logType = appenders[0].category;
    if (appenders.length && (appenders[0].typeLog || appenders[0].typePortLog)) {
        var loggers = {
            trace: function() {},
            debug: function() {},
            info: function() {},
            warn: function() {},
            error: function() {},
            fatal: function() {},
            Mask: {
                addRule: function() {},
                addRules: function() {}
            }
        }, levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
        appenders = appenders.slice(levels.indexOf(logLevel.toLowerCase()));
        config.appenders = appenders;
        // 注入配置
        this.configure(config);
        var addRuleHandles = [], addRulesHandles= [];
        // 构建对象
        appenders.forEach((apperder, index) => {
            let logLevel = apperder.category.replace(/(Port)?(Log)$/g, '');
            // 创建logger对象
            let logger = this.getLogger(apperder.category);
            // 设置日志级别
            logger.setLevel(logLevel.toUpperCase());
            // 设置日志脱敏
            logger.setMask(logMask);
            // 绑定express路由中间件日志
            if (logLevel.toLowerCase() == 'info') app.use(this.connectLogger(logger, {level: 'info', format: opts.connectFormat, mask: logMask}));
            // 注入日志方法
            loggers[logLevel] = function() {logger[logLevel].apply(logger, arguments)};
            addRuleHandles.push(function() {logger.Mask.addRule.apply(logger, arguments)});
            addRulesHandles.push(function() {logger.Mask.addRules.apply(logger, arguments)});
            loggers.Mask.type = logger.Mask.type;
        });
        // 脱敏规则
        loggers.Mask.addRule = function() {
            var argus = arguments;
            addRuleHandles.forEach((addRuleHandle, index) => {
                addRuleHandle.apply(null, argus);
            });
        };
        loggers.Mask.addRules = function() {
            var argus = arguments;
            addRulesHandles.forEach((addRulesHandle, index) => {
                addRulesHandle.apply(this, argus);
            });
        };
        return loggers;
    } else {
        // 注入配置
        this.configure(config);
        // 创建logger对象
        let logger = this.getLogger(logType);
        // 设置日志级别
        logger.setLevel(logLevel.toUpperCase());
        // 设置日志脱敏
        logger.setMask(logMask);
        // 绑定express路由中间件日志
        app.use(this.connectLogger(logger, {level: 'info', format: opts.connectFormat, mask: logMask}));
        return logger;
    }

};

module.exports = log4js;