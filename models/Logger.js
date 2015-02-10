var log4js = require('log4js');

log4js.configure(config.app.loggerConfigFile);

var LEVELS = ['DEBUG', 'TRACE', 'INFO', 'WARN', 'FATAL'];

var logger = {
	_logger: log4js.getLogger('logger'),
	_logger2: log4js.getLogger('logger2'),
	log: function(level) {
		level = level.toLowerCase();
		logger = ['warn', 'fatal'].indexOf(level) != -1 ? this._logger2 : this._logger;
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		logger[level].apply(logger, args);
	}
}

LEVELS.forEach(function(level) {
	level = level.toLowerCase();
	logger[level] = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(level);
		this.log.apply(this, args);
	}
})
module.exports = logger;
