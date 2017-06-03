var config = require('../config');
var dht = require('node-dht-sensor');
var EventEmitter = require('events').EventEmitter;

var DHT = function(dht_type, dht_pin, dht_interval) {
	this.dht_type = null;
	this.dht_pin = null;
	this.dht_interval = null;
	this.dht_timeout = null;

	this.init = function() {
		_this.dht_type = (( dht_type || config.dht_type ));
		_this.dht_pin = (( dht_pin || config.dht_pin ));
		_this.dht_interval = (( dht_interval || config.dht_interval ));

		_this.dht_read();
	}


	this.dht_read = function() {
		clearTimeout(_this.dht_timeout);

		dht.read(_this.dht_type, _this.dht_pin, function(err, temperature, humidity) {
			if(!err) {
				_this.emit('data', {
					temperature: temperature,
					humidity: humidity
				});
			}

			_this.dht_timeout = setTimeout(_this.dht_read, _this.dht_interval);
		});
	}


	this.toFahrenheit = function(celsius) {
		return celsius * 1.8 + 32;
	}


	this.toF = function(celsius) {
		return _this.toFahrenheit(celsius);
	}


	this.toKelvin = function(celsius) {
		return celsius + 273.15;
	}


	this.toK = function(celsius) {
		return _this.toKelvin(celsius);
	}


	var _this = this;
	this.init();
};

require('util').inherits(DHT, EventEmitter);

module.exports = DHT;
