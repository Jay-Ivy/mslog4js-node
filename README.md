# mslog4js-node

This is a conversion of the [mslog4js]()
framework to work with [node](http://nodejs.org). I started out just stripping out the browser-specific code and tidying up some of the javascript to work better in node. It grew from there. Although it's got a similar name to the Java library [log4j](https://logging.apache.org/log4j/2.x/), thinking that it will behave the same way will only bring you sorrow and confusion.

The full documentation is available [here]().

Out of the box it supports the following features:

* coloured console logging to stdout or stderr
* file appender, with configurable log rolling based on file size or date
* SMTP appender
* GELF appender
* Loggly appender
* Logstash UDP appender
* logFaces (UDP and HTTP) appender
* multiprocess appender (useful when you've got worker processes)
* a logger for connect/express servers
* configurable log message layout/patterns
* different log levels for different log categories (make some parts of your app log as DEBUG, others only ERRORS, etc.)

## installation

```bash
npm install mslog4js
```

## usage

Minimalist version:
```javascript
var log4js = require('mslog4js');
var logger = log4js.getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");
```
By default, mslog4js will not output any logs (so that it can safely be used in libraries). The `level` for the `default` category is set to `OFF`. To enable logs, set the level (as in the example). This will then output to stdout with the coloured layout (thanks to [masylum](http://github.com/masylum)), so for the above you would see:
```bash
[2010-01-17 11:43:37.987] [DEBUG] [default] - Some debug messages
```
See example.js for a full example, but here's a snippet (also in `examples/fromreadme.js`):
```javascript
const log4js = require('mslog4js');
log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});

const logger = log4js.getLogger('cheese');
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');
```
Output (in `cheese.log`):
```bash
[2010-01-17 11:43:37.987] [ERROR] cheese - Cheese is too ripe!
[2010-01-17 11:43:37.990] [FATAL] cheese - Cheese was breeding ground for listeria.
```

## Contributing
Contributions welcome, but take a look at the [rules](https://github.com/Jay-Ivy/mslog4js-node/wiki/Contributing) first.

## License

The original mslog4js was distributed under the Apache 2.0 License, and so is this. I've tried to
keep the original copyright and author credits in place, except in sections that I have rewritten
extensively.