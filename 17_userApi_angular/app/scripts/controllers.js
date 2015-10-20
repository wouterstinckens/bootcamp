(function() {
	'use strict'

	angular
		.module('controllers', [])
		.controller('UserController', UserController);

	function UserController($scope, userService) {
		var vm = this;

		var page = 0;
		var pagesize = 20;

		vm.eof = false;
		vm.users = [];
		vm.alerts = [];
		vm.sortList = sortList;

		activate();

		////////////

		function activate() {
			// do nothing
		}

		function addCustomers() {
			userService.getCustomers(page, pagesize)
				.then(function(users) {
					if (users.length == 0) {
						return vm.eof = true;
					} 
					vm.users = vm.users.concat(users);
					page++;
				})
				.catch(function(err) {
					vm.error = err;
				});
		}

		function sortList(column) {
			vm.orderStyles = [];
			if (vm.orderColumn === column) {
				vm.orderStyles[column] = 'glyphicon glyphicon-triangle-top'
				return vm.orderColumn = '-' + column;
			} 
			vm.orderStyles[column] = 'glyphicon glyphicon-triangle-bottom'
			return vm.orderColumn = column;
		};

		vm.deleteUser = function(user) {
			userService.deleteCustomer(user)
				.then(function(deletedUser) {
					vm.users = vm.users.filter(function(userInArr) {
						return userInArr != user;
					});
				})
				.catch(function(err) {
					vm.error = err;	
				});
		}

		vm.addMoreItems = function() {
			addCustomers();
		}

		vm.addAlert = function() {
			vm.alerts.push({
				type: 'danger',
				msg: 'alert-danger'
			});
		}

		vm.closeAlert = function(alert) {
			vm.alerts = vm.alerts.filter(function(alertInArr) {
				return alertInArr != alert;
			});
		}


	};
})();