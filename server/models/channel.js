var async = require('async');
var util = require('util');
var User = require('./user').User;
var mongoose = require('./../lib/database/mongoose'),
	Schema = mongoose.Schema;

// схема модели пользователя
var schema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		enum: ['room', 'user'],
		required: true
	},
	users : [{type:mongoose.Schema.Types.ObjectId, ref:'User'}]
});

schema.statics.findOrCreate = function(type , user_create_id, user_add_id, callback) {
	var Channel = this;
	//если пользоваетель хочет добавить сама себя
	if(user_create_id === user_add_id) {
		return callback("Alredy Exist!");
	}

	Channel.findOne( { $and: [ { users: { $in: [user_create_id] }  }, { users: { $in: [user_add_id] } }, {type:type} ] }, function(err, channel) {

		if (!err)
		{
			if(channel) {
				callback("Alredy Exist!",null);
			} else {
				var new_channel_obj = {
					name:type + "_" + user_create_id + "_" + user_add_id,
					type:type,
					users:[user_create_id, user_add_id]
				};
				var new_channel = new Channel(new_channel_obj);
				new_channel.save(function (err) {
					if (err) { return callback(err) }
					callback(null, new_channel);
				});
			}

		}
		else
		{
			callback(err);
		}
	});
}

schema.statics.getContactsByUserID = function(id, Users, callback) {
	var Channel = this;

	Channel.find({ users: { $in: [id] } },function (err, channelsData) {
		if (!err)
		{
			var channels = [];
			if(channelsData.length > 0) {
				//Говнокодик
				//проходим по всем каналам
				channelsData.forEach(function(channel, index) {
					var customObject = {_id:channel._id, name: channel.name, is_online:false, type:channel.type, avatar:"", users:[]};
					if(channel.type === "user") {
						channel.users.splice(channel.users.indexOf(id), 1);
						customObject.users = channel.users;
						if(channel.users.length > 0) {
							var userID = channel.users[0];
							//Знаю , что плохо передавать глобальный объект , но ничего пока не поделаешь
							customObject.is_online = Users.hasOwnProperty(userID);
							//нужно будет очень сильно подумать ) асинхронно могут данные и не подтянуться =)
							User.getUserByID(userID, function(err, user) {
								customObject.name = user.username;
								customObject.avatar = user.avatar;
							});
						}
					} else {
						customObject.avatar = "";
					}


					channels[index] = customObject;
				});
			}
			callback(null,channels);
		}
		else
		{
			callback(err);
		}

	});

}

exports.Channel = mongoose.model('Channel', schema);
