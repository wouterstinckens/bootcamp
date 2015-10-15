var mailSystem = require('./mailSystem');

// var backend = {
//     transfer:  function(mails) {
//         console.log('>>>>>> Transfer emails to backend:', mails);
//     }
// }

mailSystem.init('info@euri.com'); // from address 
mailSystem.sendWelcomeMail('peter.cosemans@gmail.com', // to address
                           'Welcome to...', // subject
                           { name: 'peter'}); // model



// mailSystem.transferEuriMails(backend);
