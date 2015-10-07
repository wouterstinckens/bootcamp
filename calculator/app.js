$(document).ready(function() {
	
	$("#add").click(function(event) {
		event.preventDefault();
		calculate(calcModule.add, getValues());
	});

	$("#multiply").click(function(event) {
		event.preventDefault();
		calculate(calcModule.multiply, getValues());
	});

	
	var getValues = function() {
		return [$("#value1").val(), $("#value2").val()];
	}

	var calculate = function(fn, values) {
		var sum = fn(parseInt(values[0]), parseInt(values[1]));
		$("#result").text(sum);
	}

});