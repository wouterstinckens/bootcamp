(function() {
	'use string'

	angular
		.module('myApp')
		.factory('myService', myService);

	function myService($http) {
		function getCustomers() {
			return $http({
				url: 'http://localhost:3000/api/users',
				method: "GET"
			});
		}

		function deleteCustomer(id) {
			return $http({
				url: 'http://localhost:3000/api/users/' + id,
				method: "DELETE"
			});
		}

		return {
			getCustomers: getCustomers,
			deleteCustomer: deleteCustomer
		}
		
	};

})();