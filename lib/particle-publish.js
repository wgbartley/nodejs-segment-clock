var Particle = require('particle-api-js');
var config = require('../config');
var EventEmitter = require('events').EventEmitter;
var particle = new Particle();

var ParticlePublish = function(api_token, interval, event, device_name) {
	this.api_token = null;
	this.interval = null;
	this.event = null;
	this.device_name = null;
	this.timeout = null;


	this.init = function() {
		_this.api_token = (( api_token || config.particle_api_token ));
		_this.interval = (( interval || config.particle_pub_interval ));
		_this.event = (( event || config.particle_pub_event ));
		_this.device_name = (( device_name || config.particle_device_name ));

		_this.trigger();
	}


	this.publish = function(data) {
		if(Object.keys(data).length==0)
			return;

		var metrics = [];
		for(var i in data) {
			metrics.push(i+":"+data[i]+"|g");
		}

		var pub = _this.device_name+";"+metrics.join(",");

		console.log(pub);		

		particle.publishEvent({
			auth: _this.api_token,
			name: _this.event,
			data: pub,
			isPrivate: true
		});
	}


	this.trigger = function() {
		clearTimeout(_this.timeout);

		_this.emit('trigger');

		_this.timeout = setInterval(_this.trigger, _this.interval);
	}


	var _this = this;
	this.init();
}

require('util').inherits(ParticlePublish, EventEmitter);
module.exports = ParticlePublish;
