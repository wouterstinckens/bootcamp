(function() {
	"use strict"

    angular
    	.module('myApp') 
    	.controller('MyController', MyController);


    function MyController($scope, myService) {
		$scope.quantity = 100;
		$scope.cost = 10;
		$scope.message = 'hello angular';
		$scope.showMessage = true;
		myService.getCustomers()
			.then(function(response) {
				$scope.customers = response.data;
			})
			.catch(function(err) {
				$scope.message = err;
			});
		$scope.computeMessage = function() {
			$scope.message = 'hello' + $scope.quantity;
		};
		$scope.addCustomer = function() {
			$scope.customers.push({
				name: $scope.name,
				city: $scope.city
			});
			console.log($scope.customers);
		};
		$scope.toggleMessage = function() {
			$scope.showMessage = !$scope.showMessage;
			$scope.showAlert = !$scope.showAlert;
		};
		$scope.messageStyle = {
			"background-color" : "red",
			"font-size" : "x-large"
		};
	};
})();
