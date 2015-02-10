// Load all config at once.
var fs = require('fs');
var path = require('path');
var loadConfig = function(dir) {
	var configDir = __dirname + path.sep + dir;
	var files = fs.readdirSync(configDir);
	var config = {};
	for (var file in files) {
		var name = files[file];
		if (name.indexOf('.json') != name.length - 5)
			continue;
		if (fs.statSync(configDir + path.sep + name).isFile()) {
			var basename = path.basename(name, '.json');
			if (!basename) {
				throw new Exception('Invalid config file:' + name);
			}
			config[basename] = require('./' + dir + path.sep + name);
		}
	}
	return config;
}

var mergeConfig = function(dest, src) {
	for (var key in src) {
		// if (!dest[key]) {
		// 	throw new Error('Item not in production config, item:' + key);
		// }
		if (typeof dest[key] == 'object') {
			mergeConfig(dest[key], src[key]);
		} else {
			dest[key] = src[key];
		}
	}
}

var config = loadConfig('production');

// Merge development config to production.
if (process.env.NODE_ENV != 'production') {
	var development = loadConfig('development');
	mergeConfig(config, development);
}

var getPluginHost = function(plugId, useSmarttag) {
	var map = config.app.plugHostMap;
	var host = useSmarttag ? config.app.comptruntime.host : config.app.runtime.host;
	return map[plugId] || host;
}

config.getPluginHost = getPluginHost;

config.getPluginIndex = function(plugId, useSmarttag) {
	var url = 'http://' + config.getPluginHost(plugId, useSmarttag) + '/runtime';
	if (!useSmarttag) {
		url += '/';
	}
	return url;
}
module.exports = config;
