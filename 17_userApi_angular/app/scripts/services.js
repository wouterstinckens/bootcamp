(function() {
	'use string'

	angular
		.module('myApp')
		.provider('userService', userService);

	function userService() {

		var baseUrl = null;
		var pagesize = null;
		
		this.setConfig = function(myBaseurl, myPagesize) {
			baseurl = myBaseurl;
			pagesize = myPagesize;
		}

		this.$get = function ($http, config) {
			function getCustomers(page) {
				return $http({
					url: baseurl + '/users',
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
					url: baseurl + '/users/' + user.id,
					method: "DELETE"
				})
				.then(function(response) {
					return response.data;
				});
			}

			return {
				getCustomers : getCustomers,
				deleteCustomer : deleteCustomer
			}
			
		};

	}

})();