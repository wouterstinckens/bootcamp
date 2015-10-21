module.exports = {
    map: function map(user){
console.log(user);
        var userResource = {
            id: user._id,
            name: user.firstName + ' ' + user.lastName,
            age: user.age,
            email: user.email,
            address: user.homeAddress.addressLine,
            city: user.homeAddress.city,
            zip: user.homeAddress.zip
        }
        return userResource;
    }
}
