// commonJS
// module.exports = 'aaaa'
// module.exports.foo = function() {}

class Calc {
	add(x, y) {
		return x+y;
	}
	mul(x, y) {
		return x*y;
	}
}

class Car {
	start() {
		console.log('Car started');
	}
}


//E6
var calc = new Calc();
export { calc, Car }; 