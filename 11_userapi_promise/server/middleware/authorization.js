var base64 = require('base-64');

module.exports = function (username, password) {
	return function authorize(req, res, next) {
		var authorization = req.headers.authorization;
		if (!authorization) return res.status(401).send();
		
		var base64Str = authorization.split(' ')[1];
	 	var decoded = base64.decode(base64Str);
		var arr = decoded.split(':');
		if (arr[0] == username && arr[1] == password) {
			req.username = arr[0];
			return next();
		}
		return next(error(401));
	};
};

function error(status) {
	var error = new Error('An unknown error occurred');
	error.status = status;
	return error;
};

