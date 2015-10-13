var _ = require('underscore');
var express = require('express');
var mongoose = require('mongoose');
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


// setup services
router.get('/', function(req, res, next) {
	User.find(function(err, users) {
		var formattedUsers = _.map(users, function(user) {
			return userMapper.map(user);
		});
		return res.status(200).send(formattedUsers);
	});
});

router.get('/:id', function(req, res, next) {
	User.findOne({_id: req.params.id}, function(err, user) {
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
    user.save(function() {
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
		
		user.remove(function() {
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
