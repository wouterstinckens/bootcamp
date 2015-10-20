(function() {
	'use strict'

	angular
		.module('controllers', [])
		.controller('UserController', UserController);

	function UserController($scope, $interval, userService) {
		var vm = this;

		var page = 0;
		var pagesize = 20;
		var timer = null;

		vm.eof = false;
		vm.users = [];
		vm.alerts = [];
		vm.counter = 10;
		vm.sortList = sortList;
		vm.delay = 1000;

		activate();

		////////////

		function activate() {
			startTimer();
		}

		function startTimer() {
			if (timer) {
				$interval.cancel(timer);
			}
			timer = $interval(function() {
				vm.counter--;
				if (vm.counter === 0) {
					vm.addAlert('warning', 'End of time!');
					vm.counter = 10;
				}
          	}, vm.delay);
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

		vm.addAlert = function(type, msg) {
			vm.alerts.push({ type: type, msg: msg });
		}

		vm.closeAlert = function(alert) {
			vm.alerts = vm.alerts.filter(function(alertInArr) {
				return alertInArr != alert;
			});
		}


	};
})();