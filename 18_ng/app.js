(function() {

    angular
        .module('myApp', [

            // angular
            'ngRoute',

            // 3th party
            'ui.router',

            // app
            'app.controllers'
        ])
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('view1', {
                    url: '/view1',
                    templateUrl: './view1.html',
                    controller: 'View1Controller',
                    controllerAs: 'vm'
                })
                .state('view2', {
                    url: '/view2/:userId',
                    templateUrl: './view2.html',
                    controller: 'View2Controller',
                    controllerAs: 'vm'
                });

            $urlRouterProvider.otherwise('view1');

            // $routeProvider
            //     .when('/view1', {
            //         templateUrl: './view1.html',
            //         controller: 'View1Controller',
            //         controllerAs: 'vm'
            //     })
            //     .when('/view2/:userId?', {
            //         templateUrl: './view2.html',
            //         controller: 'View2Controller',
            //         controllerAs: 'vm'
            //     })
            //     .otherwise({
            //         redirectTo: '/view1'
            //     });
        })
        .run(function($routeScope, $log) {
            $rootScope.$on('$stateChangeError', 
                function(event, toState, toParams, fromState, fromParams, error) {
                    $log.error(error);
                });
            );

            // $rootScope.$on('$routeChangeStart', function(next, current) {
            //     $log.info('route started', next, current);
            // });
            // $rootScope.$on('$routeChangeSuccess', function(current, previous) {
            //     $log.info('route changed', current, previous);
            // });
            // $rootScope.$on('$routeChangeError', function(current, previous) {
            //     $log.info('route change error', current, previous);
            // });
        })

})();
