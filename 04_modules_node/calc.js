'Use Strict'

class Calc {
     
	add(arg1, arg2) {
		return arg1+arg2;
	};

	multiply(arg1, arg2) {
		return arg1*arg2;
	};
};

module.exports = new Calc();
