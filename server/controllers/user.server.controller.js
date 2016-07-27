var User 				= require('../models/user.server.model'),
		cloudinary 	= require('cloudinary'),
		gravatar		= require('gravatar'),
		secrets			= require('../../config/secret'),
		token				= require('../../config/token');

module.exports = {
		welcome: function(req, res) {
				return res.status(200).json({"message": "Welcome to my youtube clone"});
		},

		signUpUser: function(req, res) {
			User.findOne({email : req.body.email}, '+password', function(err, existingUser) {
					if(existingUser) {
							return res.status(409).json({"message": "Email already exists"});
					}

					var getImage = gravatar.url(req.body.email, {s: '200', r: 'x', d: 'retro'}, true);

					var user = new User({
						fullName: req.body.fullName,
						email: req.body.email,
						password: req.body.password,
						user_gravatar: getImage
					});

					user.save(function(err, result) {
							if(err) {
									return res.status(500).json({message: err.message});
							} 
							res.send({token: token.createJWT(result)});
					});
			});
		},

		getLoggedInUserDetails: function(req, res) {
			User.findById(req.user, function(err, user) {
					res.send(user);
			});
		},

		updateLoggedInUser: function(req, res) {
			User.findById(req.user, function(err, user) {
					if(!user) {
							return res.status(400).json({message: "User not found"});
					}

					user.fullName = req.body.fullName || user.fullName;
					user.email = req.body.email || user.email;

					user.save(function(err, result) {
							if(err) {
									return res.status(500).json({message: err.message});
							} 
							res.status(200).send({message: "Profile updated"});
					});
			});
		},

		authenticateUser: function(req, res) {
				User.findOne({email: req.body.email}, function(err, user) {
						if(!user) {
								return res.status(401).json({message: "Invalid email"});
						}

						user.comparePassword(req.body.password, function(err, isMatch) {
								if(!isMatch) {
										return res.status(401).json({message: "Invalid password"});
								}
								res.send({token: token.createJWT(user)});
						});

				});
		}
};