var jwt = require('jwt-simple');
var sha256 = require('sha256');

module.exports = function (secret) {
	return function parse(req, res, next) {
		var authorization = req.headers.authorization;

		if (!authorization) return next();
		
		var decoded;
		try {
			decoded = jwt.decode(authorization.split(' ')[1], 'verysecret');
		}
		catch(err) {
			next(_error(403));
		}

		req.loggedInUser = decoded;
		return next();
	};
};

function _error(status) {
	var error = new Error('An unknown error occurred');
	error.status = status;
	return error;
};

