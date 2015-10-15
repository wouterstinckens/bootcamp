var express = require('express');
var inspector = require('schema-inspector');
var userMapper = require('../userMapper');
var logging = require('../middleware/logging');
var controller = require('../controllers/authenticationController.js');

var router = express.Router();

router.post('/', controller.authenticate);

module.exports = router;
