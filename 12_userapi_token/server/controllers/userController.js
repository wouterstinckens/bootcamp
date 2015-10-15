var _ = require('underscore');
var Q = require("q");
var mongoose = require('mongoose-q')(require('mongoose'));
var inspector = require('schema-inspector');
var userMapper = require('../userMapper');
var logging = require('../middleware/logging');
var sha256 = require('sha256');
var User = require('../model/User');

var repository = {
	findAll: function(query, pageSize, page, sort) {
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
				console.log(user);
				return res.status(200).send(userMapper.map(user));
			})
			.catch(function(err) {
				next(err);
			});
	},

	create: function(req, res, next) {
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
	},

	findAllKeys: function(req, res, next) {
		var userId = req.params.id;
		console.log(userId);
		User.findOneQ({_id: userId})
			.then(function(user) {
				console.log(user);
				var allKeys = _.map(user.apiKeys, function(apiKey) {
					return { 
						name: apiKey.name 
					};
				});
				return res.status(200).send(allKeys);
			})
			.catch(function(err) {
				console.log(err);
				next(err);			
			});
	},

	createKey: function(req, res, next) {
		// TODO add validation on name
		var createdKey;
		User.findOneQ({_id: req.params.id})
			.then(function(user) {
				if (!user) return next(_error(404));

				var name = req.body.name;
				var key = name + "-" + Math.random().toString(10);
				user.apiKeys.push({
					name: name,
					encryptedKey: sha256(key)
				});
				
				createdKey = key;
				return user.save();
			})
			.then(function() {
				// return res.set('location', 'http://localhost:3000/api/users/' + formattedUser.id).status(201).send(formattedUser); 
				console.log(createdKey);
				return res.status(201).send(createdKey); 
			})
			.catch(function(err) {
				return next(_error(500));
			});
	},

	removeKey: function(req, res, next) {
		var userId = req.params.id;
		var keyName = req.params.name;
		User.findOneQ({_id: userId})
			.then(function(user) {
				if (!user) return next(_error(404));

				key = _.findWhere(user.apiKeys, {name: req.params.name})
				if (!key) return next(_error(204));
				
				user.apiKeys.remove(key);
				return user.save();
			})
			.then(function() {
				return res.status(200).send();
			})
			.catch(function(err) {
				console.log(err);
				next(err);			
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

