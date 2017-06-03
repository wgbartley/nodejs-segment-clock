var config = require('../config');
var TSL2561 = require('sensor_tsl2561');
var EventEmitter = require('events').EventEmitter;

var Time = function() {
	this.colon_on = true;
	this.last_minute = 61;
	this.time_timeout = null;
	this.colon_timeout = null;
	this.display = null;
	this.sensor = null;
	this.sensor_timeout = null;


	this.init = function() {
		var SevenSegment = require('ht16k33-sevensegment-display');
		_this.display = new SevenSegment(0x70, 1);

		_this.sensor = new TSL2561();
		_this.sensor_init();
	}


	this.begin = function() {
		_this.time();
		_this.colon();
	}


	this.time = function() {
		clearTimeout(_this.time_timeout);

		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();

		if(minute!=_this.last_minute) {
			console.log('TIME', hour+':'+minute);

			_this.display.writeDigit(0, Math.floor(hour/10));
			_this.display.writeDigit(1, hour % 10);

			_this.display.writeDigit(3, Math.floor(minute/10));
			_this.display.writeDigit(4, minute % 10);
		}

		_this.last_minute = minute;

		_this.time_timeout = setTimeout(_this.time, 1000);
	}


	this.colon = function() {
		clearTimeout(_this.colon_timeout);

		if(config.blink_colon) {
			if(_this.colon_on)
				_this.display.writeDigitRaw(2, 2);
			else
				_this.display.writeDigitRaw(2, 0);

			_this.colon_on = !_this.colon_on;
		} else
			_this.display.writeDigitRaw(2, 2);

		_this.colon_timeout = setTimeout(_this.colon, 750);
	}


	this.brightness = function(val) {
		if(!!val)
			return _this.display.setBrightness(val);
	}


	this.sensor_init = function() {
		_this.sensor.init(function(err, data) {
			if(err) return console.log(err);

			_this.sensor_brightness();
		});
	}


	this.sensor_brightness = function() {
		clearTimeout(_this.sensor_timeout);

		_this.sensor.getLight0(function(err, data) {
			if(err) return console.log(err);

			var brightness0 = _map(data, config.light_min, config.light_max, 0, 100);
			var brightness1 = _map(data, config.light_min, config.light_max, 0, 15);

			_this.brightness(brightness1);
			_this.emit("light", brightness0);
		});

		_this.sensor_timeout = setTimeout(_this.sensor_brightness, config.light_interval);
	}

	var _this = this;

	this.init();

	return _this;
}


function _map(value, fromLow, fromHigh, toLow, toHigh) {
	var x = Math.round((value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow);

	if(x>toHigh) x = toHigh;

	return x;
}

require('util').inherits(Time, EventEmitter);
module.exports = Time;
