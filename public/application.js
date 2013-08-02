$(document).ready(function() {
	var username;

	$('#chat-form').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			url: '/messages',
			type: 'post',
			data: { msg: $('#chat-msg').val(),
							name: username }
		});
	});

	$('#user-form').on('submit', function(e) {
		username = $('#user-name').val();
		e.preventDefault();
		$.ajax({
			url: '/users',
			type: 'post',
			data: { user: username }
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
			$('.message_list').append('<p>'+data.message.name+' says: ' +data.message.msg+'</p>');
		}
	}
});