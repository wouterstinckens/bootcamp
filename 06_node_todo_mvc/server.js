var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var _ = require('underscore');
var apiTodo = require('./todo');

var app = express();

// server configuration
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// route configuraition
app.use('/api/todos', apiTodo);

// setup server
var port = process.env.PORT || 3000;
var server  = app.listen(port, function() {
	console.log('Express server listening on port: ' + server.address().port);
});

