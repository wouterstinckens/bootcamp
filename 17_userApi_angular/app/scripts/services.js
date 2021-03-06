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

		this.$get = function (userResource, config) {
			
			// var userResource = $resource(baseurl + "/users/:id", {id:'@id'});


			function getCustomers(page) {
				return userResource.query({page: page}).$promise;
			}

			function deleteCustomer(user) {
				return userResource.remove(user).$promise;
			}

			return {
				getCustomers : getCustomers,
				deleteCustomer : deleteCustomer
			}
			
		};

	}

})();