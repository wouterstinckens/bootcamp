'Use Strict'

var calc = require('./calc');
var argv = require('yargs').argv;

var fn = argv['x'];
var val1 = parseInt(argv._[0]);
var val2 = parseInt(argv._[1]);

console.log(calc[fn](val1, val2));
