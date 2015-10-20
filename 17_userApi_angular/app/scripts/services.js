(function() {
	'use string'

	angular
		.module('myApp')
		.service('userService', userService);

	function userService($http) {
		function getCustomers(page, pagesize) {
			return $http({
				url: 'api/users',
				method: "GET",
				params: {
					page: page,
					pageSize: pagesize
				}
			})
			.then(function(response) {
				return response.data;
			});
		}

		function deleteCustomer(user) {
			return $http({
				url: 'api/users/' + user.id,
				method: "DELETE"
			})
			.then(function(response) {
				return response.data;
			});
		}

		this.getCustomers = getCustomers;
		this.deleteCustomer =  deleteCustomer;
		
	};

})();