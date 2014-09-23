;(function(global) {
	'use strict';

	// デフォルト設定
	var defaults = {
		lang: 'ja-JP',
		pitch: 1,
		rate: 1,
		volume: 1
	};

	function Speaker() {}

	Speaker.prototype = {
		_getOpts: function() {
			var opts = _.extend({}, defaults),
				config = new SpeechSynthesisUtterance();

			for(var p in opts) {
				if(!opts.hasOwnProperty(p)) continue;

				config[p] = opts[p];
			}
			return config;
		},
		say: function(sentence, callback) {
			var config = this._getOpts();

			config.timestamp = new Date().getTime();
			console.log(config);	// FIXME: なぜかconsole.logしないとonendが取れない

			config.text = sentence;
			config.onend = function() {
				console.log('speaker:end', config);
				callback();
			};

			speechSynthesis.speak(config);
		}
	};

	global.Speaker = Speaker;
}(this));

speechSynthesis._speak = speechSynthesis.speak;
speechSynthesis.speak = function() {
	speechSynthesis._speak.apply(speechSynthesis, arguments);
};