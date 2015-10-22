(function() {

	angular
		.module('myApp')
		.controller('MyController', function($scope, $log) {
			var vm =this;

			vm.message = "Hello world!";

			vm.doThat = function() {
				$log.info('do that');
			};
		});
})();