var smtpTransport = require('./smtpTransport');
var repository = require('./repository');
var template = require('string-template');
var _ = require('underscore');
var s = require('underscore.string');

var mailSystem = module.exports = {};
var fromAddress = 'noreply@euri.com';

mailSystem.init = function(from) {
    fromAddress = from;
}

mailSystem.sendWelcomeMail = function(to, subject, model) {
    if (!to) throw new Error('to address is mandatory');

    var body = template("Hello {name}, this mail is concerning...", model);
    var mail = {
        toAddress: to,
        fromAddress: fromAddress,
        subject: subject,
        body: body
    }

    smtpTransport.send(mail);
}

// mailSystem.transferEuriMails = function(backend) {
//     // get mail from db
//     var mails = repository.getMails();

//     // get filtered mails
//     var filteredMails = _.filter(mails, function(mail) {
//         return (s.include(mail.to, 'euri.com'));
//     });

//     // transfer to backend
//     backend.transfer(filteredMails);
// }
