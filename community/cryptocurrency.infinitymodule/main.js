const fiplab = require('fiplab');
const request = require('request');

const CurrencyUpdater = require('./CurrencyUpdater');

let symbol = fiplab.arguments.symbol;
let displayCurrency = fiplab.arguments.currency;

let updater = new CurrencyUpdater(symbol, displayCurrency);
updater.update()
.then(function(obj){
  let price = obj.price;
  let options = obj.options
  fiplab.exit(price, true, options);
})
.catch(function(err){
  fiplab.exit(err.toString(), false);
});