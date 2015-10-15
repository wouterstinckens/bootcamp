var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var apiUser = require('./routers/user');
var apiAuth = require('./routers/auth');
var authorization = require('./middleware/authorization')
var errorhandler = require('./middleware/globalErrorHandler')
var mongoose = require('mongoose-q')(require('mongoose'));
var faker = require('faker');
var User = require('./model/User');
var tokenParser = require('./middleware/token-parser');

// setup db
mongoose.createConnection('mongodb://localhost/restapi');

// init db
var userCollection = [];
_(1).times(function() {
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
User.find().execQ()
	.then(function(err, users) {
		if (users.length > 0) {
			return console.log("Records found, not inserting bulk data...");
		}
		console.log("No records found, inserting bulk data...");
		return User.collection.insert(userCollection);
	});



// setup app
var app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// setup authorization
app.use(tokenParser("verysecure"));

// setup route configuraition
app.use('/api/users', apiUser);
app.use('/api/auth', apiAuth);

app.use(errorhandler());

// setup server
var port = process.env.PORT || 3000;
var server  = app.listen(port, function() {
	console.log('Express server listening on port: ' + server.address().port);
});




