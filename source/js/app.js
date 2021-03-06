
// 出題順をシャッフル
quiz = _.shuffle(quiz);

var speaker  = new Speaker(),
	recorder = new Recorder(),
	player   = new Player(),
	grades   = [
		{
			message: 'ゴミカス',
			label: 'default'
		},
		{
			message: 'まだまだだね',
			label: 'default'
		},
		{
			message: 'あと一歩',
			label: 'warning'
		},
		{
			message: 'すごいですね！',
			label: 'success'
		}
	];

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
	$('.questions').text(player.asked);
	$('#question').text(question.question);

	// 残り時間をMAXに
	$('#parked-time').css({width: '100%'});

	// ヒントを空に
	$('#hints').empty();

	speaker.say(question.question, function() {
		var past = 0,
			tid;

		// ヒント・残り時間を描画
		recorder.recording(function() {
			$('#recorder-state').text('ON').parent().removeClass('alert-danger').addClass('alert-success');

			// 音声入力可能になったら
			tid = setInterval(function() {
				past++;

				var percentage = (100 - (past / question.time * 100));
				$('#parked-time').css({width: percentage + '%'});

				if(!_.isUndefined(question.hints)) {
					var showableIdx = Math.ceil((past / question.time) * (question.hints.length));

					$('#hints').empty();
					question.hints.slice(0, showableIdx).forEach(function(hint, i) {
						var $li = $('<li></li>').text('ヒント' + i + '：' + hint);
						$('#hints').append($li);
					});
				}
			}, 1000);
		}, function() {
			$('#recorder-state').text('OFF').parent().removeClass('alert-success').addClass('alert-danger');

			// 音声入力が終わったらタイマーをリセット
			clearInterval(tid);
		});

		recorder.start(function(said) {
			var msg = '';
			if(_.contains(question.answers, said)) {
				player.accept();
				msg = '正解です！';
			} else {
				player.wrong();
				msg = '不正解です！';
			}

			$('.accepted').text(player.accepted);

			speaker.say(msg, function() {
				next(q, idx + 1);
			});
		}, function() {
			alert('8秒以内に答えてください！');
			console.error(arguments);
		});
	});
}

function finished() {
	$('#result').modal('show');
	speaker.say('クイズ終了です', function() {
		var grade = grades[Math.floor((player.accepted / player.asked) * (grades.length - 1))],
			// NOTE: 中と書くと"なか"と読まれることがある
			msg   =  player.asked + '問ちゅう' + player.accepted + '問正解でした。';
		
		speaker.say(msg, function() {
			$('#grade').addClass('label-' + grade.label).text(grade.message);
			speaker.say(grade.message);
		});
	});
}

$(function() {
	// 初期描画
	$('.questions').text(player.asked);
	$('.accepted').text(player.accepted);
	$('#question').text(question.question);

	next(quiz);
});
