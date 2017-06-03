var config = require('./config');
var Time = require('./lib/time');
var RGBButton = require('./lib/rgb_button');
var Player = require('./lib/player');
var TSL2561 = require('sensor_tsl2561');
var DHT = require('./lib/dht');
var ParticlePublish = require('./lib/particle-publish');

console.log('CONFIG', config);

var time = new Time();
var rgb = new RGBButton();
var player = new Player();
var dht = new DHT();
var pub = new ParticlePublish();


// Metrics to send when publishing
var metrics = { m: 0 };


// Listen for our light metric
time.on('light', function(data) {
	metrics.l = data;
});


// Listen for temperature and humidity metrics
dht.on('data', function(data) {
	metrics.f = dht.toF(data.temperature).toFixed(2);
	metrics.h = data.humidity.toFixed(2);
});


// Listen for our publish trigger
pub.on('trigger', function() {
	pub.publish(metrics);
});


// Listen for music player status changes
player.on('play', function(data) {
	if(data===true)
		metrics.m = 1;
	else
		metrics.m = 0;

	pub.publish(metrics);
});


// Start things!
time.begin();
player.begin();


// And an initial publish to kick things off
setTimeout(function() {
	pub.publish(metrics);
}, 5000);
