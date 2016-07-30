var jwt = require('jwt-simple'),
		secrets = require('./secret'),
		moment = require('moment'),
		SHOW_MESSAGE = require('../server/messages'),
		SHOW_STATUS_CODE = require('../server/statusCode');


/*********************************
	Creating JWT token for registered and login jusers
***********************************/

function createJWT(user) {
	var payload = {
		sub: user._id,
		iat: moment().unix(),
		exp: moment().add(14, 'days').unix()
	};

	return jwt.encode(payload, secrets.TOKEN_SECRET);
}


/**********************************************
		MIDDLE WARE FOR LOGIN AUTHENTICATION
***********************************************/

function ensureAuthenticated(req, res, next) {
	if(!req.header('Authorization')) {
			return res.status(SHOW_STATUS_CODE.STATUS_CODE.UNAUTHORISED).json({message: SHOW_MESSAGE.MESSAGE.USER.AUTHORIZATION_ERROR});
	}

	//don't know what the split is doing here
	var token = req.header('Authorization').split(' ')[1];
	payload = null;

	try {
		payload = jwt.decode(token, secrets.TOKEN_SECRET);
	} 
	catch(err) {
		return res.status(SHOW_STATUS_CODE.STATUS_CODE.UNAUTHORISED).send({message: err.message});
	}

	if(payload.exp <= moment().unix()) {
		return res.status(SHOW_STATUS_CODE.STATUS_CODE.UNAUTHORISED).json({message: SHOW_MESSAGE.MESSAGE.USER.EXPIRE_TOKEN});
	}

	req.user = payload.sub;
	next();
}

module.exports = {
	createJWT: createJWT,
	ensureAuthenticated: ensureAuthenticated
};