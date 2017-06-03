var config = require('../config');

var RGBButton = function() {
	this.wpi = {};
	this.last_button = 2;
	this.pins = {
		'red': config.red_pin,
		'green': config.green_pin,
		'blue': config.blue_pin
	};

	this.defaults = {
		'breathe_delay': 20,
		'fade_delay': 10
	};

	this.init = function() {
		_this.wpi = require('wiringpi-node');
		_this.wpi.setup('gpio');
		_this.wpi.pinMode(config.button_pin, _this.wpi.INPUT);
		_this.wpi.pullUpDnControl(config.button_pin, _this.wpi.PUD_DOWN);

		for(var i in _this.pins) {
			_this.wpi.pinMode(_this.pins[i], _this.wpi.SOFT_PWM_OUTPUT);
			_this.wpi.digitalWrite(_this.pins[i], 0);
			_this.wpi.softPwmCreate(_this.pins[i], 100, 100);
			_this.wpi.softPwmWrite(_this.pins[i], 100);
		}
	}


	this.breathe_dir = 1;
	this.breathe_val = 100;
	this.breathe_delay = 30;
	this.breathe_timer;

	this.breathe = function(color, delay) {
		if(!!!color)
			color = config.button_color;

		_this.breathe_dir = 1;
		_this.breathe_val = 100;

		if(!!delay)
			_this.breathe_delay = delay;
		else
			_this.breathe_delay = _this.defaults.breathe_delay;

		_this.breathe_handler(color);
	}

	this.breathe_handler = function(color) {
		_this.stop();

		_this.wpi.softPwmWrite(_this.pins[color], _this.breathe_val);

		if(_this.breathe_val>=100 || _this.breathe_val<=0)
			_this.breathe_dir = !_this.breathe_dir;

		if(_this.breathe_dir==1)
			_this.breathe_val++;
		else
			_this.breathe_val--;

		_this.breathe_timer = setTimeout(function() {
			_this.breathe_handler(color);
		}, _this.breathe_delay);
	}


	this.fade_val = 100;
	this.fade_dir = 0;
	this.fade_delay = 10;
	this.fade_max = 0;
	this.fade_min = 100;
	this.fade_timer;

	this.fade_in = function(color, delay, fade_min) {
		if(!!!color)
			color = config.button_color;

		_this.stop();

		_this.fade_val = 100;
		_this.fade_dir = 0;

		if(!!fade_min)
			_this.fade_min = fade_min;
		else
			_this.fade_min = 100;

		_this.fade_handler(color);
	}


	this.fade_out = function(color, delay, fade_max) {
		if(!!!color)
			color = config.button_color;

		if(!!_this.breathe_timer && _this.breathe_timer._idleTimeout>0)
			_this.fade_val = _this.breathe_val;
		else
			_this.fade_val = 0;

		_this.stop();

		_this.fade_dir = 1;

		if(!!fade_max)
			_this.fade_max = fade_max;
		else
			_this.fade_max = 0;

		_this.fade_handler(color);
	}


	this.fade_handler = function(color, delay) {
		_this.stop();

		_this.wpi.softPwmWrite(_this.pins[color], _this.fade_val);

		if(!!delay)
			_this.fade_delay = delay;
		else
			_this.fade_delay = _this.defaults.fade_delay;

		if(_this.fade_dir==0)
			_this.fade_val--;
		else
			_this.fade_val++;

		if(_this.fade_val<=_this.fade_max && _this.fade_dir==1)
			_this.fade_timer = setTimeout(function() {
				_this.fade_handler(color);
			}, _this.fade_delay);
		else if(_this.fade_val>=_this.fade_min && _this.fade_dir==0)
			_this.fade_timer = setTimeout(function() {
				_this.fade_handler(color);
			}, _this.fade_delay);
	}


	this.stop = function() {
		clearTimeout(_this.breathe_timer);
		clearTimeout(_this.fade_timer);
	}


	this.read = function() {
		return _this.wpi.digitalRead(config.button_pin);
	}


	var _this = this;
	this.init();

	return this;
}


module.exports = RGBButton;
