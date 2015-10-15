module.exports = function () {
	return function authorize(req, res, next) {
		if (!req.loggedInUser) {
			return next(_error(403));
		}
		return next();
	};
};

function _error(status) {
	var error = new Error('An unknown error occurred');
	error.status = status;
	return error;
};

