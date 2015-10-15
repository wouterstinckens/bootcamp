var chai = require("chai");
chai.use(require('chai-as-promised'));
var expect = chai.expect;

var myService = require('./myService');

describe('myService', function() {
	// it('test', function(done) {
	// 	myService.find('query', function (err, data) {
	// 		expect(data).to.equal('abc');
	// 		done();
	// 	});
	// });

	xit('test success', function(done) {
		myService.find('query')
			.then(function (data) {
				expect(data).to.equal('abc');
				done();
			})
			.catch(function(err) {
				done(err);
			});
		});

	xit('test failure', function(done) {
		myService.find('')
			.then(function (data) {
				done('should not be in here...');
			})
			.catch(function(err) {
				expect(err).to.equal('bad value');
				done(); 
			})
			.catch(function(err) {
				done(err); 
			});
		});

	it('test success', function(done) {
		var promise = myService.find('query');
		expect(promise)
			.to.eventually.equal('abc')
			.notify(done);
	});

	it('test faulure', function(done) {
		var promise = myService.find('');
		expect(promise)
			.to.be.rejectedWith('bad value')
			.notify(done);
	});
});