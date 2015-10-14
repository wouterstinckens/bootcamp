define([], function() {
	var add = function(arg1, arg2) {
		return arg1+arg2;
	};

	var multiply = function(arg1, arg2) {
		return arg1*arg2;
	};

	return {
		add: add,
		multiply: multiply
	}
})

