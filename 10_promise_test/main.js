var Q = require("q");

function find(query, callback) {
	setTimeout(function() {
		if (!query) {
			return callback("bad value");
		}
		return callback(null, query);
	}, 2000);
};

console.log('start');

function findQ(query) {
	var deferred = Q.defer();

	setTimeout(function() {
		if (!query) {
			return deferred.reject('bad value');
		}
		return deferred.resolve('abc');
	}, 2000);

	return deferred.promise;
};

find('query1', function(err, result) {
	if (err) 
		console.log('error: ' + err);
	else
		console.log('ok: ' + result);
	find('query2', function(err, result) {
		if (err) 
			console.log('error: ' + err);
		else
			console.log('ok: ' + result);
		find('query3', function() {
			if (err) 
				console.log('error: ' + err);
			else
				console.log('ok: ' + result);
		});
	});
});

findQ('Qquery1')
	.then(function(result) {
		console.log('Qok: ' + result);
		return findQ('Qquery2');
	})
	.then(function(result) {
		console.log('Qok: ' + result);
		return findQ('Qquery3');
	})
	.then(function(result) {
		console.log('Qok: ' + result);
	})
	.catch(function(err) {
		console.log('Qerror: ' + err);
	});