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
        appenders = [
            {
                type: 'console',
                category: 'console'
            }, // 控制台输出
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
                pattern: '.' + opts.port + '.yyyyMMdd.log',
                alwaysIncludePattern: true
            } // 日期格式文件单端口输出
        ].filter(function(data) {
            return data.category == logType;
        });

    // 注入配置
    this.configure({
        appenders: appenders,
        replaceConsole: true,   //替换console.log
        levels: {
            console: 'ALL',
            fileLog: 'ALL',
            portFileLog: 'ALL',
            dateFileLog: 'ALL'
        }
    });

    // 创建logger对象
    let logger = this.getLogger(logType);
    // 设置日志级别
    logger.setLevel(logLevel.toUpperCase());
    // 设置日志脱敏
    logger.setMask(logMask);
    // 绑定express路由中间件日志
    app.use(this.connectLogger(logger, {level: 'info', format: opts.connectFormat, mask: logMask}));
    return logger;
};

module.exports = log4js;