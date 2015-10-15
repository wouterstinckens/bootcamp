var mongoose = require('mongoose-q')(require('mongoose'));
var User = require('../model/User');
var jwt = require('jwt-simple');
var sha256 = require('sha256');

module.exports = {
	authenticate: function(req, res, next) {
		var apiKey = req.body.apiKey;

		console.log(apiKey);

		if (!apiKey) return next(_error(404));

		var encKey = sha256(apiKey);
		console.log(encKey);
		User.findOneQ({'apiKeys.encryptedKey': encKey}) // TODO: right search method
			.then(function(user) {
				console.log(user);
				var payload = {
				    "sub": 12242344,
				    "iat": 1232312,
				    "iis": "euri:bootcamp",
				    "name": user.name,
				    "userId": user._id
				};
				var secret = 'verysecret';

				console.log('payload: ' + payload);
 
				// encode 
				var token = jwt.encode(payload, secret);
				return res.status(200).send({
					accessToken: token,
					tokenType: 'bearer'
				});
			})
			.catch(function(err) {
				return next(err);
			})
	}
}