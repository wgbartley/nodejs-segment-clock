var e = process.env;

exports.verbose = (( e.VERBOSE || false ));

exports.base_dir = __dirname;
exports.music_dir = (( e.MUSIC_DIR || 'music' ));

exports.default_mp3 = (( e.DEFAULT_MP3 || 'my_favorite.mp3' ));

exports.http_port = parseInt(( e.HTTP_PORT || 8000 ));

exports.blink_colon = (( e.BLINK_COLON || false ));
exports.military_time = (( e.MILITARY_TIME || false ));

exports.button_color = (( e.BUTTON_COLOR || 'blue' ));
exports.button_pin = parseInt(( e.BUTTON_PIN || 12 ));

exports.red_pin = parseInt(( e.RED_PIN || 20));
exports.green_pin = parseInt(( e.GREEN_PIN || 16 ));
exports.blue_pin = parseInt(( e.BLUE_PIN || 13 ));

exports.amixer = (( e.AMIXER || '/usr/bin/amixer' ));
exports.mpg123 = (( e.MPG123 || '/usr/bin/mpg123' ));
exports.mixer = (( e.MIXER || 'SoftMaster' ));
exports.max_volume = parseInt(( e.MAX_VOLUME || 60 ));
exports.min_volume = parseInt(( e.MIN_VOLUME || 0 ));

exports.light_min = (( e.LIGHT_MIN || 0 ));
exports.light_max = (( e.LIGHT_MAX || 1000 ));
exports.light_interval = (( e.LIGHT_INTERVAL || 1000 ));

exports.dht_type = (( e.DHT_TYPE || 22 ));
exports.dht_pin = (( e.DHT_PIN || 6 ));
exports.dht_interval = (( e.DHT_INTERVAL || 2000 ));

exports.particle_api_token = (( e.PARTICLE_API_TOKEN || '' ));
exports.particle_device_name = (( e.PARTICLE_DEVICE_NAME || require('os').hostname() ));
exports.particle_pub_event = (( e.PARTICLE_PUB_EVENT || 'my_event' ));
exports.particle_pub_interval = (( e.PARTICLE_PUB_INTERVAL || 60000 ));
