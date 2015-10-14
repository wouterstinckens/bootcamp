var map = function(dbuser) {
	return {
		id: dbuser._id,
		name: dbuser.firstName + " " + dbuser.lastName,
		age: dbuser.age,
		email: dbuser.email,
		address: dbuser.homeAddress.addressLine,
		city: dbuser.homeAddress.city,
		zip: dbuser.homeAddress.zip
	}
};

module.exports = {
	map: map
};


