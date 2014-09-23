
function Recorder(lang) {
	this.lang = lang;
	this._recorder = new webkitSpeechRecognition();
}

Recorder.prototype = {
	start: function(success, error) {
		error = error || null;

		this._recorder.onresult = function(e) {
			var said = e.results[0][0].transcript;
			success(said);
		};
		this._recorder.onerror = error;

		// reset
		this._recorder.onend = _(function() {
			console.log('recorder:end');
			this._recorder.onresult = null;
			this._recorder.onerror = null;
			this._recorder.onend = null;
		}).bind(this);

		try {
			this._recorder.start();
		} catch(e) {}
	},
	end: function() {
		this._recorder.end();
	}
};
