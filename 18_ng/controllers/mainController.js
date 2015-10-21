(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller("MainController", MainController)
        .controller("View1Controller", View1Controller)
        .controller("View2Controller", View2Controller)


    function MainController($state) {
        var vm = this;

        vm.message = 'hello world';
        vm.gotoView2 = gotoView2;

        activate();

        /////////

        function activate() {

        }

        function gotoView2() {
            $state.go('view2');
        }
    };

    function View1Controller($log) {
        var vm = this;

        vm.message = 'hello world - view1';

        $log.info("View1Controller");
    }

    function View2Controller($log, $stateParams) {
        var vm = this;

        $log.info('stateParams parameter', $stateParams.userId)

        vm.message = 'hello world - view2';

        $log.info("View2Controller");
    }

})();
