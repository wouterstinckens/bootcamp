(function() {
	'use strict'

	angular
		.module('myApp', [
			'infinite-scroll',
			'controllers',
			'ui.bootstrap'
		])
		.constant('config', {
			pagesize: 20
		})
		.factory('_', function($window) {
			return $window._;
		})
		.config(function(userServiceProvider, config) {
			userServiceProvider.setConfig('/api', config.pagesize);
		});
})();