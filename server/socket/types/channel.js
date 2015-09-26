var User = require('../../models/user').User;
var Channel = require('../../models/channel').Channel;
var Message = require('../../models/message').Message;
var sendStatus = require('../../lib/channelstatus');

module.exports = function (socket, Users) {

	// Вход пользователя в комнату чата
	var userData = Users[socket.handshake.user._id],
		channel = userData.channel;


	sendStatus(socket.handshake.user._id, Users, "s.channel.online");

	socket.join(channel);
	// Обнаружение пользователя в данной комнате
	// Оповещение пользователя о том, что он находится в новой комнате

	socket.emit('s.channel.join', {channel: channel});

	socket.on('c.channel.join', function(channel) {
		socket.leave(userData.room);
		Users[socket.handshake.user._id].channel = channel.id;
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
							send_data = Channel.prepareChannel(socket.handshake.user._id, channel, Users);
						}
						//Таймаут для того, что данные по пользователю приходят асинхронно
						setTimeout(function () {
							Users[socket.handshake.user._id].contacts[send_data._id] = send_data;
							var toUser = send_data;
							sendStatus(socket.handshake.user._id, Users, 's.channel.add', toUser, send_data);
							socket.emit('s.channel.add', send_data);
						}, 50);
					});
				}
			} else {
				//пользователь не найден
				socket.emit('s.channel.add', send_data);
			}

		});
	});

	socket.on('c.channel.delete', function(channel) {
		Channel.findOne({_id:channel.id}).remove(function(err, mess) {
			var sendObject = {id:channel.id, is_delete :mess.result.n === 1};
			//Удаление сообщений по каналу
			Message.find({ channelId: { $in: [channel.id] }  }).remove();
			var toUser = userData.contacts[channel.id];
			sendStatus(socket.handshake.user._id, Users, 's.channel.delete', toUser);
			//И удаляем из глобального объекта пользователя данный контакт
			Users[socket.handshake.user._id].contacts[channel.id];

			socket.emit('s.channel.delete', sendObject);
		});
	});

	socket.on('disconnect', function() {
		sendStatus(socket.handshake.user._id, Users, "s.channel.offline");
	});

};


