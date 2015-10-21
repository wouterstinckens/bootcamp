(function() {
	angular.module('myApp')
		.filter('uppercase', function() {
			return function(input, uppercase) {
				input = input || '';
				return uppercase ? input.toUpperCase() : input.toLowerCase();
			}
		})
		.filter('charbreaker', function() {
			return function(input) {
				input = input || '';
				return input.split("").reverse().join("");
			}
		})
		.filter('gmail', function($log) {
			return function(users) {
    			var filtered = [];
    			angular.forEach(users, function(user) {
      				if (user.email.indexOf('gmail') > -1) {
        				filtered.push(user);
        			}
      			});
      			return filtered;
    		};
		});

})();