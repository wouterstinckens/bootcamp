(function() {
	'use strict'

	angular
		.module('myApp')
		.controller('MyController', MyController);

	function MyController($scope, myService) {
		myService.getCustomers()
			.then(function(response) {
				$scope.users = response.data;
			})
			.catch(function(err) {
				$scope.error(err);
			});

		$scope.sortList = function(column) {
			if ($scope.orderColumn === column) {
				return $scope.orderColumn = '-' + column;
			}
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
					$scope.error(err);	
				});
		}
	};
})();