var _ = require('underscore');
var express = require('express');
var mongoose = require('mongoose');
var faker = require('faker');
var userMapper = require('./userMapper');

var router = express.Router();

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
User.find().remove().exec();
User.collection.insert(userCollection, function(err, docs) {
	if (err) {
		console.log("Error while inserting records: " + err);
	} 
	else {
		console.log("Succes, number of documents inserted: " + docs.insertedCount);
	}

});


// setup services
router.get('/', function(req, res, next) {
	console.log(next);
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

	User.find()
		.limit(pageSize)
		.skip(page * pageSize)
		.sort(sort)
		.exec(function(err, users) {
			var formattedUsers = _.map(users, function(user) {
				return userMapper.map(user);
			});
			console.log("number of returned records: " + formattedUsers.length);
			return res.status(200).send(formattedUsers);
		});
});

router.get('/:id', function(req, res, next) {
	User.findOne({_id: req.params.id}, function(err, user) {
		if (err) {
			return res.status(500).send('There is a problem: ' + err);
		}

		if (user) {
			return res.status(200).send(userMapper.map(user));
		}
		return res.status(404).send('user not found');
	});
});

router.post('/', function(req, res, next) {
	if (!(req.body.name && req.body.email)) {
		return res.status(400).send("bad request");
	}
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
    	if (err) {
    		return res.status(500).send('We have a problem: ' + err);
    	}
    	var formattedUser = userMapper.map(user);
    	return res.set('location', 'http://localhost:3000/api/users/' + formattedUser.id).status(201).send(formattedUser); 
    });
});

router.put('/:id', function(req, res, next) {
	if (!(req.body.name && req.body.email)) {
		return res.status(400).send('bad request');
	}

	User.findOne({_id: req.params.id}, function(err, user) {
		if (!user) {
			return res.status(404).send('User not found');
		}
		
		var nameObj = _splitNames(req.body.name);
		user.firstName = nameObj.firstName;
		user.lastName = nameObj.lastName;
		user.age = req.body.age;
		user.email = req.body.email;
		user.homeAddress.addressLine = req.body.address;
		user.homeAddress.city = req.body.city;
		user.homeAddress.zip = req.body.zip;
		
		user.save(function() {
			return res.status(200).send(userMapper.map(user));
		});
	});
});

router.delete('/:id', function(req, res, next) {
	User.findOne({_id: req.params.id}, function(err, user) {
		if (!user) {
			return res.status(404).send('User not found');
		}
		
		user.remove(function(err) {
			return res.status(200).send(userMapper.map(user));
		});
	});
});


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
}


module.exports = router;
