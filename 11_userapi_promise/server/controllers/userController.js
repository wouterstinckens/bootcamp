var _ = require('underscore');
var Q = require("q");
var mongoose = require('mongoose');
var faker = require('faker');
var inspector = require('schema-inspector');
var userMapper = require('../userMapper');
var logging = require('../middleware/logging');


// setup db
mongoose.connect('mongodb://localhost/restapi');
var User = mongoose.model('User', {
	firstName: String,
	lastName: String,
	age: Number,
	email: String,
	homeAddress: {
		addressLine: String,
		city: String,
		zip: String
	}
});


// init db
var userCollection = [];
_(1000).times(function() {
	userCollection.push({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(), 
		age: faker.random.number(),
		email: faker.internet.email(),
		homeAddress: {
			addressLine: faker.address.streetAddress(),
			city: faker.address.city(),
			zip: faker.address.zipCode()
		}
    });
});
// User.find().remove().exec();
// User.collection.insert(userCollection);


var repository = {
	findAll: function(query, pageSize, page, sort) {
		console.log("test");
		var deferred = Q.defer();
		User.find(query)
			.limit(pageSize)
			.skip(page * pageSize)
			.sort(sort)
			.exec(function(err, users) {
				if (err) {
					return deferred.reject(err);
				}
				var formattedUsers = _.map(users, function(user) {
					return userMapper.map(user);
				});
				deferred.resolve(formattedUsers);
		});
		return deferred.promise;
	},
	findOne: function(query) {
		var deferred = Q.defer();
		User.findOne(query, function(err, user) {
			if (err) {
				return deferred.resolve(null);
			}
			deferred.resolve(user);
		});
		return deferred.promise;
	},
	save: function(user) {
		var deferred = Q.defer();
		user.save(function(err) {
			if (err) {
				return deferred.reject(err);
			}
			deferred.resolve(user);
		});
		return deferred.promise;
	}
};


module.exports = {

	findAll: function(req, res, next) {
	    var pageSize = 0;
	    if (req.query.pageSize) {
	    	pageSize = parseInt(req.query.pageSize);
	    }
	    var page = 0;
	    if (req.query.page) {
	    	page = parseInt(req.query.page);
	    }
	    var sort = '';
	    if (req.query.sort) {
	    	sort = req.query.sort;
	    }

		var query = {};
		repository.findAll(query, pageSize, page, sort)
			.then(function(formattedUsers) {
				console.log("number of returned records: " + formattedUsers.length);
				return res.status(200).send(formattedUsers);
			})
			.catch(function(err) {
				next(err);			
			});
	},

	findOne: function(req, res, next) {
		repository.findOne({_id: req.params.id})
			.then(function(user) {
				if (!user) return next(_error(404));
				return res.status(200).send(userMapper.map(user));
			})
			.catch(function(err) {
				next(err);
			});
	},

	create: function(req, res, next) {
		console.log('test');
		var nameObj = _splitNames(req.body.name);
		var user = new User({
			firstName: nameObj.firstName,
			lastName: nameObj.lastName, 
			age: req.body.age,
			email: req.body.email,
			homeAddress: {
				addressLine: req.body.address,
				city: req.body.city,
				zip: req.body.zip
			}
	    });
	    user.save(function(err) {
			if (err) return next(err);

	    	var formattedUser = userMapper.map(user);
	    	return res.set('location', 'http://localhost:3000/api/users/' + formattedUser.id).status(201).send(formattedUser); 
	    });
	},


	update: function(req, res, next) {
		repository.findOne({_id: req.params.id})
			.then(function(user) {
				if(!user)
					return next(_error(404));
				
				var nameObj = _splitNames(req.body.name);
				user.firstName = nameObj.firstName;
				user.lastName = nameObj.lastName;
				user.age = req.body.age;
				user.email = req.body.email;
				user.homeAddress.addressLine = req.body.address;
				user.homeAddress.city = req.body.city;
				user.homeAddress.zip = req.body.zip;

				return repository.save(user);
			})
			.then(function(user) {
				res.status(200).send(userMapper.map(user));
			})
			.catch(function(err) {
				return next(err);
			});
	},

	delete: function(req, res, next) {
		User.findOne({_id: req.params.id}, function(err, user) {
			if (!user) return next(_error(404));
			
			user.remove(function(err) {
				if (err) return next(err);

				return res.status(200).send(userMapper.map(user));
			});
		});
	}
};

function _splitNames(name) {
	var result = { firstName: '', lastName: ''};
	
	var nameArray = name.split(' ');
	if (nameArray.length > 0) {
		result.firstName = nameArray[0];
	}
	if (nameArray.length > 1) {
		var lastName = '';
		_.each(nameArray, function(n, index) {
			if (index > 0) {
				if (lastName.length > 1) {
					lastName += ' ';
				}
				lastName += n;
			}
		});
		result.lastName = lastName;
	}

	return result;
};

function _error(status) {
	var error = new Error('An unknown error occurred');
	error.status = status;
	return error;
};

