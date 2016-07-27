var User = require("./controllers/user.server.controller"),
		token = require("../config/token");

		module.exports = function(app) {
			app.get('/api', token.ensureAuthenticated, User.welcome);
			app.post('/api/login', User.authenticateUser);
			app.post('/api/register', User.signUpUser);
			app.get('/api/me', token.ensureAuthenticated, User.getLoggedInUserDetails);
			app.put('api/me', token.ensureAuthenticated, User.updateLoggedInUser);
		};