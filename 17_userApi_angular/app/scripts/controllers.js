(function() {
	'use strict'

	angular
		.module('myApp')
		.controller('MyController', MyController);

	function MyController($scope, myService) {
		var page = 0;
		var pagesize = 20;

		$scope.eof = false;
		$scope.users = [];
		// addCustomers();

		function addCustomers() {
			myService.getCustomers(page, pagesize)
				.then(function(response) {
					if (response.data.length == 0) {
						return $scope.eof = true;
					} 
					$scope.users = $scope.users.concat(response.data);
					page++;
				})
				.catch(function(err) {
					$scope.error = err;
				});
			}

		$scope.sortList = function(column) {
			$scope.orderStyles = [];
			if ($scope.orderColumn === column) {
				$scope.orderStyles[column] = 'glyphicon glyphicon-triangle-top'
				return $scope.orderColumn = '-' + column;
			} 
			$scope.orderStyles[column] = 'glyphicon glyphicon-triangle-bottom'
			return $scope.orderColumn = column;
		};

		$scope.deleteUser = function(user) {
			myService.deleteCustomer(user.id)
				.then(function() {
					$scope.users = $scope.users.filter(function(userInArr) {
						return userInArr != user;
					});
				})
				.catch(function(err) {
					$scope.error = err;	
				});
		}

		$scope.addMoreItems = function() {
			addCustomers();
		}
	};
})();