
module.exports = function(password) {
	return function authorize(req, res, next) {
		console.log(req.headers.authorization);
		if (password && req.headers.authorization !== password) {
			return res.status(401).send();
		}
		return next();
	}
};

