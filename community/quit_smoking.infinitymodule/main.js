const fiplab = require('fiplab');
const moment = require('moment');
const currencyFormatter = require('currency-formatter');
const countdown = require('countdown');
countdown.setLabels('ms|s|m|h|d|w|mo|y','ms|s|m|h|d|w|mo|y',' ', ' ');
require('moment-countdown');

//Get config
let date = fiplab.arguments.date;
let perDay = fiplab.arguments.perDay;
let perPack = fiplab.arguments.perPack;
let pricePerPack = fiplab.arguments.pricePerPack;
let currency = fiplab.arguments.currency;
let showAs = fiplab.arguments.showAs;

//Calculate
let now = moment();
let then = moment(date, 'YYYY-MM-DD hh:mm:ss');

let diff = then.diff(now);

if(diff > 0){
  fiplab.exit('Please enter a date in the past', false);
  return;
}

diff = Math.abs(diff) / 1000;
let days = (diff / 86400);

let timeSince = now.countdown(then, countdown.DAYS | countdown.HOURS | countdown.MINUTES).toString();
let cigsSaved = Math.round(days * perDay);

let priceSaved = ((days / (perPack / perDay)) * pricePerPack);
let priceString = currencyFormatter.format(priceSaved, {'code': currency});

//Return it all
let result = [];

if(showAs === 'saved'){
  result = [priceString, 'Smoke Free Days: ' + timeSince, 'Cigarettes Not Smoked: ' + cigsSaved];
}
else if(showAs === 'date'){
  result = [timeSince, 'Amount Saved: ' + priceString, 'Cigarettes Not Smoked: ' + cigsSaved];
}
else{
  result = [cigsSaved, 'Amount Saved: ' + priceString, 'Smoke Free Days: ' + timeSince];
}

fiplab.exit(result.join('\n'), true);