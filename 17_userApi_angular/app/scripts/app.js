(function() {
	'use strict'

	angular
		.module('myApp', [
			'infinite-scroll',
			'controllers',
			'ui.bootstrap'
		])
		.factory('_', function($window) {
			return $window._;
		});
})();