var config = require('../config');
var RGBButton = require('./rgb_button');
var Music = require('./music');
var EventEmitter = require('events').EventEmitter;

var rgb = new RGBButton();
var music = new Music();


var Player = function() {
	this.play_timeout = {};
	this.last_button = 2;
	this.curr_button = -1;
	this.playing = false;

	this.begin = function () {
		_this.handler();
	}


	this.end = function() {
		clearTimeout(_this.play_timeout);
	}


	this.handler = function() {
		clearTimeout(_this.play_timeout);

		_this.curr_button = rgb.read();

		if(_this.curr_button!=_this.last_button && _this.curr_button==1) {
			rgb.fade_out(config.button_color, 10, 99);
			_this.playing = true;
			music.play();
			_this.emit("play", true);


		} else if(_this.curr_button!=_this.last_button && _this.curr_button==0) {
			rgb.breathe(config.button_color);
			_this.playing = false;
			music.stop();
			_this.emit("play", false);
		}

		_this.last_button = _this.curr_button;

		_this.play_timeout = setTimeout(_this.handler, 100);
	}


	var _this = this;

	return this;
}

require('util').inherits(Player, EventEmitter);
module.exports = Player;
