let fiplab = require('fiplab');
let util = require('util');

let apiKey = fiplab.arguments.apiKey;
let symbol = fiplab.arguments.symbol;
let display = fiplab.arguments.display;

const alpha = require('alphavantage')({key: apiKey});

alpha.data.daily(symbol).then(data => {
  let daily = data['Time Series (Daily)'];
  let today = daily[Object.keys(daily)[0]];
  let yesterday = daily[Object.keys(daily)[1]];

  //Get the current price for today
  let currentPrice = today['4. close'];
  currentPrice = parseFloat(currentPrice);

  //Get yesterdays price
  let yesterdayPrice = yesterday['4. close'];
  yesterdayPrice = parseFloat(yesterdayPrice);

  let change = ((currentPrice - yesterdayPrice) / currentPrice);
  change *= 100;

  let isUp = (change > 0);
  let changeString = (Math.round(change * 100) / 100) + '%';
  currentPrice = (Math.round(currentPrice * 100) / 100);
  currentPrice = currentPrice.toString();

  let returnString;

  if(display == 'both'){
    returnString = currentPrice + ' (' + changeString + ')';
  }
  else if(display == 'change'){
    returnString = changeString;
  }
  else{
    returnString = currentPrice;
  }

  let icon = isUp ? '▲' : '▼';

  fiplab.exit(icon + ' ' + returnString, true, {
    'color': isUp ? '#149839' : '#FD3641'
  });

}).catch(function(e){
  console.error(e);
  fiplab.exit('Invalid Symbol, please verify the stock symbol is correct and try again.', false);
});