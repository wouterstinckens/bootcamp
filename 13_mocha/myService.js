var Q = require('Q');

function MyService() {  
   this.find = function(query, callback) {  
	   var deferred = Q.defer();
       setTimeout(function() {  
           if (!query) {  
           		deferred.reject("bad value");
           }
           deferred.resolve("abc");
       }, 100);  
       return deferred.promise;
   };
};
module.exports = new MyService();