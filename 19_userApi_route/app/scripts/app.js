(function() {
	'use strict'

	angular
		.module('myApp', [
			'ngResource',
			'infinite-scroll',
			'controllers',
			'ui.bootstrap',
			'toaster',
			'ngAnimate',
			'ngSanitize',
			'ui.router',
			'ngMessages'
		])
		.constant('config', {
			pagesize: 20
		})
		.value('messUpNetwork', {
			messedUp: false
		})
		.value('routeHistory', {
			urls: [] 
		})
		.factory('userResource', ['$resource', function($resource) {
			var resource = $resource("/api/users/:id", {id:'@id'}, {
				update: {method: 'PUT'}
			});
			return resource;
		}])
		.factory('_', ['$window', function($window) {
			return $window._;
		}])
		.config(['userServiceProvider', 'config', function(userServiceProvider, config) {
			userServiceProvider.setConfig('/api', config.pagesize);
		}])
		.config(['$httpProvider', function($httpProvider) {
			$httpProvider.interceptors.push('httpMesserInterceptor');
			$httpProvider.interceptors.push('httpLogInterceptor');
			$httpProvider.interceptors.push('httpHeaderInterceptor');
			$httpProvider.interceptors.push('httpErrorInterceptor');
		}])
		.factory('httpMesserInterceptor', ['$q', 'messUpNetwork', function($q, messUpNetwork) {
			return {
				request: function(request) {
					if (messUpNetwork.messedUp) {
						request.url = request.url.split("").reverse().join("");
					}
					return $q.when(request);
				}
			};
		}])
		.factory('httpLogInterceptor', ['$q', function($q) {
			return {
				request: function(request) {
					console.log(request.method + ' ' + request.url);
					return $q.when(request);
				} 
			};
		}])
		.factory('httpHeaderInterceptor', ['$q', function($q) {
			return {
				request: function(request) {
					request.headers.Authorization = 'wouter';
					return $q.when(request);
				}
			};
		}])
		.factory('httpErrorInterceptor', ['$q', 'toaster', function($q, toaster) {
			return {
				responseError: function(request) {
					toaster.pop('error', "HTTP response", "Something went wrong!");
					return $q.reject(request);
				}
			};
		}])
		.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('userlist', {
					url: '/userlist',
					templateUrl: './userlist.html',
					controller: 'UserController',
					controllerAs: 'vm',
					resolve: {
						users: ['userService', 'config', function(userService, config) {
							return userService.getCustomers(config.pagesize);
						}]
					}
				})
				.state('useredit', {
					url: '/useredit/:userId',
					templateUrl: './useredit.html',
					controller: 'UserEditController',
					controllerAs: 'vm'
				})
				.state('useradd', {
					url: '/useradd',
					templateUrl: './useredit.html',
					controller: 'UserEditController',
					controllerAs: 'vm'
				})
				.state('alert', {
					url: '/alert',
					templateUrl: './alert.html',
					controller: 'AlertController_',
					controllerAs: 'vm'
				});

            $urlRouterProvider.otherwise('userlist');
		}])
		// .run(function($rootScope, $log, routeHistory) {
  //           $rootScope.$on('$routeChangeStart', function(angularEvent, next, current) {
	 //            if (next.$$route.originalPath == '/back') {
	 //            	var lastRoute = next.$$route = routeHistory.urls[routeHistory.urls.length -1];
	 //            	routeHistory.urls = outeHistory.urls.filter(function (url) {
  // 						return url != lastRoute;
  // 					});
	 //            	return next.$$route = route;
	 //            }

	 //            if (current) {
	 //            	routeHistory.urls.push(current.$$route);
	 //            }
  //           });
		// });

})();