module.exports = function(username, password) {
	return function logg(req, res, next) {
		console.log(req.username);
	};
};

