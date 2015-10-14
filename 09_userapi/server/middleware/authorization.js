var base64 = require('node-base64-image');

module.exports = authorize;

function authorize(username, password) {
	return function authorize(req, res, next) {
		console.log(req.headers.authorization);
		if (!req.headers.authorization) return res.status(401).send();

		var buff = new Buffer(req.headers.authorization, 'base64');
		var arr = buff.toString('utf8').split();
		console.log(arr);
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

