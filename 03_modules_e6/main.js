// commonJS
// var mod = require('./mod');

import {calc, Car} from './mod';

console.log(calc.add(1, 2));

var car = new Car();
car.start();