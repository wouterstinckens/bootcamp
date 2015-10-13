var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var apiUser = require('./user');

// setup app
var app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// route configuraition
app.use('/api/users', apiUser);

// setup server
var port = process.env.PORT || 3000;
var server  = app.listen(port, function() {
	console.log('Express server listening on port: ' + server.address().port);
});




