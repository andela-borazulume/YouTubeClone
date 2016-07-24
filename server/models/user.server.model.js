var mongoose = require('mongoose'),
		bycrpt = require('bycrpt'),
		userSchema = mongoose.Schema({
			fullName: {type: String},
			email: { type: String, required: true, unique: true, lowercase: true},
			password: { type: String, required: true},
			user_avatar:{type: String, default: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'},
			registered_on: {type: Date, default: Date.now}

		});

