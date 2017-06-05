var config = require('../config');
var EventEmitter = require('events').EventEmitter;

var Music = function() {
	this.spawn = null;
	this.mpg123 = null;
	this.mp3volume = null;

	this.init = function() {
		_this.spawn = require('child_process').spawn;
		_this.stop();
	}


	this.play = function() {
		_this.emit('play', true);

		_this.mpg123 = _this.spawn(config.mpg123, [config.base_dir+'/'+config.music_dir+'/'+config.default_mp3, '--loop -1']);
		_this.mp3volume = _this.spawn(config.amixer, ['sset', config.mixer, config.max_volume+'%']);
	}


	this.stop = function() {
		_this.emit('play', false);

		_this.mp3volume = _this.spawn(config.amixer, ['sset', config.mixer, config.min_volume+'%']);

		try {
			_this.mpg3123.kill();
		} catch(e) {
			// Do nothing
		}
	}


	var _this = this;

	this.init();

	return this;
}


require('util').inherits(Music, EventEmitter);
module.exports = Music;
