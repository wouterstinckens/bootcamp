(function() {
	'use strict'

	angular
		.module('controllers', [])
		.controller('UserController', UserController)
		.controller('UserEditController', UserEditController)
		.controller('AlertController', AlertController);

	function UserController($scope, $interval, userService, messUpNetwork, $filter, users ) {
		var vm = this;

		var page = 0;
		var timer = null;

		vm.eof = false;
		vm.users = [];
		vm.alerts = [];
		vm.counter = 10;
		vm.delay = 1000;
		
		// public functions
		vm.sortList = sortList;
		vm.messWithUrl = messWithUrl;

		vm.text = "<strong>hello world!</strong>";

		activate();

		////////////

		function messWithUrl() {
			messUpNetwork.messedUp = !messUpNetwork.messedUp;
		}

		function activate() {
			// startTimer();
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
			var gmailFilter = $filter('gmail');
			userService.getCustomers(page)
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
		}

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

	function UserEditController($stateParams, $log, $scope, userService) {
		var vm = this;
		vm.userId = $stateParams.userId;
		vm.action = vm.userId ? 'Edit' : 'Add';
		vm.submit = submit;
		vm.user = null;

		activate();

		/////////

		function activate() {
			if (vm.userId) {
				userService.getCustomer(vm.userId)
					.then(function(user) {
						vm.user = user;
					})
					.catch(function(err) {
						vm.error = err;
					});
			}
		}

		function submit(valid) {
			if (!valid) {
				return ;
			}

			$scope.submitting = true;

			userService.saveCustomer(vm.user)
				.then(function(user) {
					vm.user = user;
				})
				.catch(function(err) {
					vm.error = err;
				});
		}
	};

	function AlertController() {

	};

})();