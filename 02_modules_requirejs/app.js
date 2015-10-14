define([calc], function(calc) {
	$("#add").click(function(event) {
		event.preventDefault();
		calculate(calc.add, getValues());
	});

	$("#multiply").click(function(event) {
		event.preventDefault();
		calculate(calc.multiply, getValues());
	});

	var getValues = function() {
		return [$("#value1").val(), $("#value2").val()];
	}

	var calculate = function(fn, values) {
		var sum = fn(parseInt(values[0]), parseInt(values[1]));
		$("#result").text(sum);
	}

});