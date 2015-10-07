require.config({
	paths: {
		'jquery': './bower_components/jquery/dist/jquery',
		'domready': './bower_components/requirejs-domready/domReady'
	}
});

require(['jquery', 'domready', './calc'], function($, domReady, calc) {
	domReady(function() {
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
});

// commonJS
// var mod = require('./mod');
// mod.action();
