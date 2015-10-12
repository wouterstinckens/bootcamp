var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/users', function(req, res, next) {
	var users = [
		{ id: 12, name: 'peter'},
		{id: 22, name: 'jan'},
		{id: 344, name: 'piet'}
	]
	res.send(users);
});

app.get('/api/users/:id', function(req, res, next) {
	console.log(req.params.id);
	var user = { id: 12, name: 'peter'};
	res.send(user);
});

app.get('/api/products', function(req, res, next) {
	res.send('products from sample');
});

app.post('/api/users', function(req, res, next) {
	var user = req.body;
	user.id = 3000;
	res.send(user);
});

app.put('/api/users/:id', function(req, res, next) {
	console.log(req.params.id);
	console.log(req.body);
	res.send({ id: 12, name: 'peter'});
});

app.delete('/api/users/:id', function(req, res, next) {
	console.log(req.params.id);
	console.log(req.body);
	res.send({ id: 12, name: 'peter'});
});

var port = process.env.PORT || 3000;


var server  = app.listen(port, function() {
	console.log('Express server listening on port: ' + server.address().port);
});
