//
// Program:     Life Lived
//
// Description: This is a Infinity Dashboard module for showing
//              the percentage of life lived so far based on an
//              average life expectancy that the user can configure.
//

const fiplab = require('fiplab');

let averageage = fiplab.arguments.lifeexp;
let bday = new Date(fiplab.arguments.datebirth);
let now = new Date();
let differentYears = Math.floor((((now.getTime() - bday.getTime())/(1000 * 3600 * 24))/365.25));
let percentagelife = Math.floor((differentYears/averageage)*100)

fiplab.exit(String(percentagelife) + "%", true);