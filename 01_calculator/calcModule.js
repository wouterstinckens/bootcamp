var calcModule = (function(calcModule) {
	'User Strict'

	calcModule.add = function(arg1, arg2) {
		return arg1+arg2;
	}

	calcModule.multiply = function(arg1, arg2) {
		return arg1*arg2;
	}

	return calcModule;
})(calcModule || {});


