
function Player() {
	this.accepted   = 0;	// 出題数
	this.dishonored = 0;	// 正解数
	this.asked      = 0;	// 不正解数(画面には出さない)
}

Player.prototype = {
	accept: function() {
		this.accepted++;
	},
	wrong: function() {
		this.dishonored++;
	}
};
