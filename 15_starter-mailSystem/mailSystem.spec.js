var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var mailSystem = require('./mailSystem');
var smtpTransport = require('./smtpTransport');



describe('mailSystem', function() {

	var sandbox = sinon.sandbox.create();
	var model, from;
	
	beforeEach(function() {
		model = {name: 'Peter'};
		from = 'wouterstinckens@gmail.com';
	});

    it('mail is sent', function() {
    	
    	var stub = sandbox.stub(smtpTransport, 'send');

    	var to = 'info@euricom.com';
    	mailSystem.init(from);
    	mailSystem.sendWelcomeMail(to, 'open position', model);

    	expect(stub).to.have.been.calledWith({
    		toAddress: to,
        	fromAddress: from,
        	subject: 'open position',
        	body: "Hello " + model.name + ", this mail is concerning..."
    	});
    });

    it('to address mandatory', function() {
    	expect(function() {
    		mailSystem.sendWelcomeMail(null, 'open position', model)
    	}).to.throw(Error);
    });

    afterEach(function() {
    	sandbox.restore();
    });
});

