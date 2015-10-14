var express = require('express');
var mongoose = require('mongoose');
var faker = require('faker');
var inspector = require('schema-inspector');
var userMapper = require('../userMapper');
var logging = require('../middleware/logging');
var controller = require('../controllers/userController.js');

var router = express.Router();

// setup services
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.post('/', validate, controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

function validate(req, res, next) {
	var resource = req.body;
	var schema = {
		properties: {
			name: { type: 'string' },
			email: { type: 'string', pattern: 'email' }
		}
	};
	var result = inspector.validate(schema, resource);
	if (!result.valid) {
		console.log(result);
		return next(error(400));
	}
	return next();
};

module.exports = router;



