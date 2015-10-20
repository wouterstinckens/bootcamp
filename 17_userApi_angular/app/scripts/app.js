(function() {
	'use strict'

	angular
		.module('myApp', [
			'ngResource',
			'infinite-scroll',
			'controllers',
			'ui.bootstrap',
			'toaster',
			'ngAnimate'
		])
		.constant('config', {
			pagesize: 20
		})
		.factory('userResource', function($resource) {
			return $resource("/api/users/:id", {id:'@id'});
		})
		.factory('_', function($window) {
			return $window._;
		})
		.config(function(userServiceProvider, config) {
			userServiceProvider.setConfig('/api', config.pagesize);
		})
		.config(function($httpProvider) {
			$httpProvider.interceptors.push('httpLogInterceptor');
			$httpProvider.interceptors.push('httpHeaderInterceptor');
			$httpProvider.interceptors.push('httpErrorInterceptor');
		})
		.factory('httpLogInterceptor', function($q) {
			return {
				request: function(request) {
					console.log(request.method + ' ' + request.url);
					return $q.when(request);
				} 
			};
		})
		.factory('httpHeaderInterceptor', function($q) {
			return {
				request: function(request) {
					request.headers.Authorization = 'wouter';
					return $q.when(request);
				}
			};
		})
		.factory('httpErrorInterceptor', function($q, toaster) {
			return {
				responseError: function(request) {
console.log(request);
					toaster.pop('error', "HTTP response", "Something went wrong!");
					return $q.reject(request);
				}
			};
		});

})();