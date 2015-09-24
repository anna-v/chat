var User = require('../../models/user').User;
var Channel = require('../../models/channel').Channel;

module.exports = function (socket, Users) {
	// Вход пользователя в комнату чата
	var userData = Users[socket.handshake.user._id],
		channel = userData.channel;

	socket.join(channel);
	// Обнаружение пользователя в данной комнате
	// Оповещение пользователя о том, что он находится в новой комнате

	socket.emit('s.channel.join', {channel: channel});

	socket.on('c.channel.join', function(channel) {
		socket.leave(userData.room);
		Users[socket.handshake.user._id].room = channel.id;
		socket.join(channel.id);
		socket.emit('s.channel.join', {channel: channel.id});
	});

	//Добавление контактов логика еще не готова
	socket.on('c.channel.add', function(user) {
		var send_data = null;
		User.findByParams(user.username, user.username, function(err, user) {
			if(user)
			{
				if(!err)
				{
					//Если канал существует
					Channel.findOrCreate("user", socket.handshake.user._id, user._id, function(err , channel) {
						if(!err)
						{
							send_data = channel;
						}

						socket.emit('s.channel.add', {data: send_data});
					});
				}
			} else {
				//пользователь не найден
				socket.emit('s.channel.add', {data: send_data});
			}

		});
	});

	socket.on('c.channel.delete', function(channel) {
		Channel.findOne({_id:channel.id}).remove(function(err, mess) {
			var sendObject = {num:channel.num, is_delete :mess.result.n === 1};
			socket.emit('s.channel.delete', sendObject);
		});
	});
};


