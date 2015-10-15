var express = require('express');
var inspector = require('schema-inspector');
var userMapper = require('../userMapper');
var logging = require('../middleware/logging');
var controller = require('../controllers/userController.js');
var authorization = require('../middleware/authorization');

var router = express.Router();

// setup services
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.post('/', authorization(), controller.create);
router.put('/:id', authorization(), controller.update);
router.delete('/:id', authorization(), controller.delete);
router.get('/:id/keys', controller.findAllKeys);
router.post('/:id/keys', controller.createKey);
router.delete('/:id/keys/:name', controller.removeKey);

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



