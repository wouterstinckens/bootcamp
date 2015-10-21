(function() {

    angular
        .module('myApp')
        .factory('customerService', customerService);

    function customerService($http) {

        function getCustomers() {
            return $http.get('customers.json')
                        .then(function(response) {
                            return response.data;
                        })
        }

        return {
            getCustomers: getCustomers
        }
    }

})();
