var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');

// setup app
var app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// setup db
mongoose.connect('mongodb://localhost/demo');
var Product = mongoose.model('Product', {
	name: String,
	price: Number
});

// setup services
app.get('/api/todos', function(req, res) {
	return req.send("Hello network!");
});

app.get('/api/products', function(req, res, next) {
	Product.find(function(err, products) {
		res.status(200).send(products);
	});
});

app.post('/api/products', function(req, res, next) {
	var product = new Product({
		name: req.body.name,
		price: req.body.price
	});
	console.log("1: " + product);
	product.save(function() {
		console.log("2: " + product);
		res.status(201).send(product);
	});
});

app.get('/api/products/:id', function(req, res, next) {
	Product.findOne({_id: req.params.id}, function(err, product) {
		console.log('product: ' + product);
		if (product) {
			return res.status(200).send(product);
		}
		return res.status(404).send('product not found');
	});
});

// setup server
var port = process.env.PORT || 3000;
var server  = app.listen(port, function() {
	console.log('Express server listening on port: ' + server.address().port);
});
