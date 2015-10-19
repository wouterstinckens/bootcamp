(function() {
	'use strict'

	angular
		.module('myApp')
		.factory('myService', myService);

	function myService($http) {
		var customers = getCustomers();

		function getCustomers() {
			return $http.get('customers.json');
		}

		return {
			getCustomers : getCustomers
		};
	};

})();