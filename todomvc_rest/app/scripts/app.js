/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var App = {
		init: function () {
            this.todoRepo = new TodoRepo();
			this.cacheElements();
			this.bindEvents();

			new Router({
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
			}).init('/all');
		},
		cacheElements: function () {
			this.todoTemplate = Handlebars.compile($('#todo-template').html());
			this.footerTemplate = Handlebars.compile($('#footer-template').html());
			this.$todoApp = $('#todoapp');
			this.$header = this.$todoApp.find('#header');
			this.$main = this.$todoApp.find('#main');
			this.$footer = this.$todoApp.find('#footer');
			this.$newTodo = this.$header.find('#new-todo');
			this.$toggleAll = this.$main.find('#toggle-all');
			this.$todoList = this.$main.find('#todo-list');
			this.$count = this.$footer.find('#todo-count');
			this.$clearBtn = this.$footer.find('#clear-completed');
		},
		bindEvents: function () {
			var list = this.$todoList;
			this.$newTodo.on('keyup', this.create.bind(this));
			this.$toggleAll.on('change', this.toggleAll.bind(this));
			this.$footer.on('click', '#clear-completed', this.destroyCompleted.bind(this));
			list.on('change', '.toggle', this.toggle.bind(this));
			list.on('dblclick', 'label', this.edit.bind(this));
			list.on('keyup', '.edit', this.editKeyup.bind(this));
			list.on('focusout', '.edit', this.update.bind(this));
			list.on('click', '.destroy', this.destroy.bind(this));
		},
		render: function () {
            this.todoRepo.getList(this.filter, function(todos) {
				this.$todoList.html(this.todoTemplate(todos));
				this.$main.toggle(todos.length > 0);
				this.todoRepo.getList('active', function(todos) {
					this.$toggleAll.prop('checked', todos.length === 0);
					this.renderFooter(todos);
					this.$newTodo.focus();
				}.bind(this));
			}.bind(this));
		},
		renderFooter: function (todos) {
            this.todoRepo.getList('all', function(todosAll) {
				this.todoRepo.getList('active', function(todosActive) {
					var todoCount = todosAll.length;
					var activeTodoCount = todosActive.length;
					var template = this.footerTemplate({
						activeTodoCount: activeTodoCount,
						activeTodoWord: util.pluralize(activeTodoCount, 'item'),
						completedTodos: todoCount - activeTodoCount,
						filter: this.filter
					});
					this.$footer.toggle(todoCount > 0).html(template);
				}.bind(this))
            }.bind(this));
		},
		toggleAll: function (e) {
			var isChecked = $(e.target).prop('checked');
			this.todoRepo.setCompleted(isChecked, function() {
				this.render();
			}.bind(this));
		},
		destroyCompleted: function () {
			this.todoRepo.removeCompleted();
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding id of the todo
		getIdFromEl: function (el) {
			return $(el).closest('li').data('id');
		},
		create: function (e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			this.todoRepo.add(val, function() {
				$input.val('');

				this.render();
			}.bind(this));

		},
		toggle: function (e) {
            var id = this.getIdFromEl(e.target);
            this.todoRepo.get(id, function(todo) {
				todo.completed = !todo.completed;
				this.todoRepo.update(todo, function(todo) {
					this.render();
				}.bind(this));
            }.bind(this));
		},
		edit: function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
		update: function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if ($el.data('abort')) {
				$el.data('abort', false);
				this.render();
				return;
			}

			var id = this.getIdFromEl(el);
			if (val) {
                var todo = this.todoRepo.get(id);
				todo.title = val;
			} else {
				this.todoRepo.remove(id);
			}

			this.render();
		},
		destroy: function (e) {
            var id = this.getIdFromEl(e.target);
			this.todoRepo.remove(id, function(todo) {
				this.render();
			}.bind(this));
		}
	};

	App.init();
});
