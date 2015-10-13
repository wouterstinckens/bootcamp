var express = require('express');
var _ = require('underscore');

var router = express.Router();

// APP
var todos = [{id: 0, title: 'eerst titel', completed: false}];

// LIST
router.get('/', function(req, res, next) {
	res.send(todos);
});

// GET
router.get('/:id', function(req, res, next) {
	var idParam = req.params.id;
	var todo = _find(idParam);
	if (!todo) {
		return res.status(404);
	}
	return res.send(todo);
});

// POST
router.post('/', function(req, res, next) {
    var body = req.body; 
    body.id = _generateId();
    todos.push(body);
    res.set('locatiob', 'http://localhost:3000/api/todos/' + body.id);
    res.status(201);
    return res.send(body);
});

// PUT: selectAll
router.put('/toggleAll?', function(req, res, next) {
	var completed = req.query.completed || true; 
	_.each(todos, function(todo) {
		todo.completed = completed;
	});	
	return res.send(todos);
});

// PUT
router.put('/:id', function(req, res, next) {
	var id = req.params.id; 
	var body = req.body; 
	var todo = 	_find(id);
	if (!todo) {
		return res.status(404).send('resource not found');
	}
	todo.title = body.title;
	todo.completed = body.completed;	
	return res.send(todo);
});

// DELETE
router.delete('/:id', function(req, res, next) {
	var id = req.params.id; 
	var todo =  _find(id);
	if (!todo) {
		return res.setus(204);
	}
	todos = _.without(todos, todo);
	return res.send(todo);
});

function _find(idParam) {
	return _.find(todos, function(todo) { return todo.id === parseInt(idParam); })
};

function _generateId() {
	var newId = 0;
    if (todos.length > 0) {
    	var todo = _.max(todos, function(todo) { return todo.id; });
    	newId = todo.id + 1;
    }
    return newId;
};

module.exports = router;
