var faker = require('faker');
var User = require('../models/user');

module.exports = {
    fillDb: function fillDb(){
        var data = [];
        for(var i = 0; i < 1000; i++){
            data.push({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                age: faker.random.number(100),
                email: faker.internet.email,
                homeAddress: {
                    addressLine: faker.address.streetAddress(),
                    city: faker.address.city(),
                    zip: faker.address.zipCode()
                }
            });
        }
        User.collection.insert(data, function(err){
            if(err){
                console.log("error: " + err);
            }
            console.log("Data inserted");
        });
    }
};
