var TodoRepo = (function() {
    'use strict'

    // private const
    const STORE_KEY = 'todos-jquery';

    class TodoRepo {

        constructor() {
            this.todos = util.store(STORE_KEY);
        }

        add(title, callback) {
            $.ajax({
                url: 'http://localhost:4000/APi/todos',
                type: 'POST',
                data: JSON.stringify({
                    title: title,
                    completed: false
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function(todo) {
                    callback(todo);
                }
            });
        }

        update(todo, callback) {
            $.ajax({
                url: 'http://localhost:4000/APi/todos/' + todo.id,
                type: 'PUT',
                data: JSON.stringify({
                    title: todo.title,
                    completed: todo.completed
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function(todo) {
                    callback(todo);
                }
            });
        }

        remove(id, callback){
            $.ajax({
                url: "http://localhost:4000/api/todos/" + id,
                type: 'DELETE',
                success: function(todo) {
                    callback(todo);
                }
            });
        }

        get(id, callback) {
            $.ajax({
                url: "http://localhost:4000/api/todos/" + id,
                type: 'GET',
                success: function(todo) {
                    callback(todo);
                }
            });
        }

        getList(filter, callback){
            $.get( "http://localhost:4000/api/todos", function(todos) {
                if (filter === 'active') {
                     callback(this._getActiveTodos(todos));
                }
                else if (filter === 'completed') {
                    callback(this._getCompletedTodos(todos));
                } 
                else {
                    callback(todos);
                }
            }.bind(this));



        }

        _getActiveTodos (todos) {
            return todos.filter(function (todo) {
                return !todo.completed;
            });
        }

        _getCompletedTodos (todos) {
            return todos.filter(function (todo) {
                return todo.completed;
            });
        }

        setCompleted(completed, callback) {
            this.getList('all', function(allTodos) {
                var ids = _.pluck(allTodos, 'id');
                $.ajax({
                    url: "http://localhost:4000/api/todos/" + ids + "/completed/" + completed,
                    type: 'PATCH',
                    success: function(updatedTodos) {
                        callback(todos);
                    }
                });
            }.bind(this));
        }

        removeCompleted(){
            this.todos = this._getActiveTodos();
        }
    }

    return TodoRepo;
})();
