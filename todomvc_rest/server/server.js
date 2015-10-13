var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var _ = require('underscore');
var apiTodo = require('./todo');
var cors = require('cors');
var cfg = require('./config');

var app = express();


// server configuration
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// route configuraition
app.use('/api/todos', apiTodo);

// setup server
var server  = app.listen(cfg.port, function() {
	console.log('Express server listening on port: ' + server.address().port);
});

