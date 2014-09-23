
function Speaker(opts) {
	for(var p in opts) {
		if(!opts.hasOwnProperty(p)) continue;

		this[p] = opts[p];
	}
}

Speaker.prototype = {

};
