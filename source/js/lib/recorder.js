
function Recorder(lang) {
	this.lang = lang;
	this._recorder = new webkitSpeechRecognition();
}

Recorder.prototype = {
	start: function(success, error) {
		error = error || null;

		this.onresult = success;
		this.onerror = error;

		this._recorder.start();
	},
	end: function() {
		this._recorder.end();
	}
};
