var mongoose = require('mongoose-q')(require('mongoose'));

module.exports = mongoose.model('User', {
	firstName: String,
	lastName: String,
	age: Number,
	email: String,
	homeAddress: {
		addressLine: String,
		city: String,
		zip: String
	},
	apiKeys: [
		{
			name: String,
			encryptedKey: String
		}
	]
});
