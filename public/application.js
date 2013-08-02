$(document).ready(function() {
	var username = "team socket";

	$('#chat-form').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			url: '/messages',
			type: 'post',
			data: { msg: $('#chat-msg').val(),
							name: username}
		});
	});


	var stream = new EventSource('/stream')

	stream.onopen = function() {
		$.ajax({
			url: '/users',
			type: 'post',
			data: { user: username }
		});
	};

	stream.onmessage = function(e) {
		var data = JSON.parse(e.data);
		console.log(data);
		if (data.message != null) {
			$('.message_list').append('<p>'+data.message.msg+'</p>');
		}
	};
});