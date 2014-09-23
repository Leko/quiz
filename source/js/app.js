
// 出題順をシャッフル
quiz = _.shuffle(quiz);

// console.log(new SpeechSynthesisUtterance());

var speaker  = new Speaker(),
	recorder = new Recorder(),
	player   = new Player();

/**
 * クイズを出題する
 * 用意されているクイズを全て出題したらクイズを終了する
 * 
 * @param object[] q 問題一覧
 * @param int      idx  現在の問題数(省略可能、省略すると0)
 * @return void
 */
function next(q, idx) {
	idx = idx || 0;

	if(idx >= q.length) {
		finished();
		return;
	}

	var question = q[idx];
	player.asked++;

	// 各種数値・問題文を描画
	$('#accepted').text(player.accepted);
	$('#questions').text(player.asked);
	$('#question').text(question.question);

	speaker.say(question.question, function() {
		recorder.start(function(said) {
			var msg = '';
			if(_.contains(question.answers, said)) {
				player.accept();
				msg = '正解です！';
			} else {
				player.wrong();
				msg = '不正解です！';
			}

			speaker.say(msg, function() {
				next(q, idx + 1);
			});
		}, function() {
			console.error(arguments);
		});
	});
}

function finished() {
	speaker.say('クイズ終了です', function() {
	});
}

$(function() {
	next(quiz);
});
