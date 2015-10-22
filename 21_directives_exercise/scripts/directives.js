(function() {

	angular
		.module('myApp')
		.directive('tabs', function() {
			return {
				restrict: 'E',
				templateUrl: '/templates/tabs.tpl.html',
				transclude: true,
				replace: true,
				controller: 'TabsController',
				controllerAs: 'vm'
			};
		})

		.controller('TabsController', function($scope, $element, $attrs, $log) {
			var vm = this;
			vm.tabs = [];

			vm.activate = function(myTab) {
				vm.tabs.forEach(function(tab) {
					tab.active = (tab == myTab);
				});
			}
		})

		.directive('tabPane', function() {
			return {
				restrict : 'E',
				templateUrl : '/templates/tabpane.tpl.html',
				require: ['tabPane', '^tabs'],
				link: function(scope, element, attrs, controllers) {
					var myCtrl = controllers[0];
					myCtrl.title = attrs.title;
					var tabsCtrl = controllers[1];
					tabsCtrl.tabs.push(myCtrl);
				},
				transclude : true,
				controller : 'TabPaneController',
				controllerAs: 'vm'
			}
		})

		.controller('TabPaneController', function ($scope, $element, $attrs, $log) {
			this.title = null;
			this.active = false;
		});

})();