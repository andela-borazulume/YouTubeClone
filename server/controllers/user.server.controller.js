var User 				= require('../models/user.server.model'),
		cloudinary 	= require('cloudinary'),
		gravatar		= require('gravatar'),
		secrets			= require('../../config/secret'),
		token				= require('../../config/token'),
		STATUS_CODE = require('../statusCode'),
		SHOW_MESSAGE     = require('../messages');

module.exports = {
		welcome: function(req, res) {
				return res.status(SHOW_STATUS_CODE.STATUS_CODE.OK).json({message: SHOW_MESSAGE.MESSAGE.WELCOME});
		},

		signUpUser: function(req, res) {
			User.findOne({email : req.body.email}, '+password', function(err, existingUser) {
					if(err) {
							return res.status(SHOW_STATUS_CODE.STATUS_CODE.BAD_REQUEST).json({message: SHOW_MESSAGE.MESSAGE.USER.BAD_REQUEST});
					}
					if(existingUser) {
							return res.status(SHOW_STATUS_CODE.STATUS_CODE.CONFLICT).json({message: SHOW_MESSAGE.MESSAGE.USER.EMAIL_EXISTS});
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
									return res.status(SHOW_STATUS_CODE.STATUS_CODE.INTERNAL_ERROR).json({message: err.message});
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
							return res.status(SHOW_STATUS_CODE.STATUS_CODE.BAD_REQUEST).json({message: SHOW_MESSAGE.MESSAGE.DOES_NOT_EXIST});
					}

					user.fullName = req.body.fullName || user.fullName;
					user.email = req.body.email || user.email;

					user.save(function(err, result) {
							if(err) {
									return res.status(SHOW_STATUS_CODE.STATUS_CODE.BAD_REQUEST).json({message: err.message});
							} 
							res.status(SHOW_STATUS_CODE.STATUS_CODE.OK).send({message: SHOW_MESSAGE.MESSAGE.UPDATE_PROFILE});
					});
			});
		},

		authenticateUser: function(req, res) {
				User.findOne({email: req.body.email}, function(err, user) {
						if(!user) {
								return res.status(SHOW_STATUS_CODE.STATUS_CODE.UNAUTHORISED).json({message: SHOW_MESSAGE.MESSAGE.INVALID_PASSWORD});
						}

						user.comparePassword(req.body.password, function(err, isMatch) {
								if(!isMatch) {
										return res.status(SHOW_STATUS_CODE.STATUS_CODE.UNAUTHORISED).json({message: SHOW_MESSAGE.MESSAGE.INVALID_PASSWORD});
								}
								res.send({token: token.createJWT(user)});
						});

				});
		}
};