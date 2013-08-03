$(document).ready(function() {
	var username = "[anonymous]";

	$('#chat-form').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			url: '/messages',
			type: 'post',
			data: { msg: $('#chat-msg').val(),
							name: username }
		});

		$("#chat-msg").val("");
		$("#chat-msg").focus();
	});

	$('#user-form').on('submit', function(e) {
		username = $('#user-name').val();
		e.preventDefault();
		$.ajax({
			url: '/users',
			type: 'post',
			data: { user: username }
		}).done(function() {
			$('#user-form').hide();
		});
	});


	var stream = new EventSource('/stream')

	stream.onopen = function() {
		$.ajax({
			url: '/users',
			type: 'post',
			data: { user: username }
		});
	}

	stream.onmessage = function(e) {
		var data = JSON.parse(e.data);
		if (data.message != null) {
			$('.message_list').prepend('<p>'+data.message.name+' says: ' +data.message.msg+'</p>');
		}
	}

	window.onbeforeunload = function() {
		$.ajax({
			url: '/users',
			type: 'DELETE',
			data: {user: username}
		});
		stream.close();
	}
});