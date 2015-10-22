(function() {

	angular
		.module('myApp')
		.directive('myButton', function() {
			return {
				restrict: 'EA',
				templateUrl: '/templates/myDirective.html',
				transclude: true,
				// template: function(element, attrs) {
				// 	var text = attrs.text || 'default text';
				// 	if (attrs.href) {
				// 		return "<a href='" + attrs.href + "' >" + text + "</a>";
				// 	}
				// 	return '<button>' + text + '</button>';
				// },
				replace: true,
				scope: {
					changeThat: '&'
				},
				controller: 'MyButtonController',
				controllerAs: 'vm'
			};
		})

		.controller('MyButtonController', function($scope, $element, $attrs, $log) {
			var vm = this;

			this.name = 'world';

			activate();

			///////

			function activate() {
				$log.info($element);
				$log.info($attrs);
				$log.info('attributes: ' + $attrs.myAttr);
			}

			vm.callMeBaby = function() {
				$log.info('call me');
			}

			vm.doThis = function() {
				$scope.changeThat();
			}
		})
})();