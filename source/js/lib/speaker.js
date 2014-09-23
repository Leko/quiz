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
		say: function(sentence, callback) {
			callback = callback || function() {};

			var config = new SpeechSynthesisUtterance(sentence);
			_.extend(config, defaults);

			config.timestamp = new Date().getTime();
			console.log(config);	// FIXME: なぜかconsole.logしないとonendが取れない

			config.addEventListener('end', function() {
				// NOTE: ここを非同期にしないと複数回同じ音声が再生される
				setTimeout(function() {
					config.removeEventListener('end');
					callback();
				}, 0);
			});

			speechSynthesis.speak(config);
		}
	};

	global.Speaker = Speaker;
}(this));

speechSynthesis._speak = speechSynthesis.speak;
speechSynthesis.speak = function() {
	speechSynthesis._speak.apply(speechSynthesis, arguments);
};