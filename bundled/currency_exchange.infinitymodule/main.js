const fiplab = require('fiplab');
const ExchangeRateUpdater = require('./ExchangeRateUpdater');
const CurrencyConvertor = require('./CurrencyConvertor');

let rateUpdater = new ExchangeRateUpdater();

rateUpdater.update()
.then(function(rates){
  try{
    let convertor = new CurrencyConvertor(rates);
    console.log(fiplab.arguments);

    let resp = convertor.convertFromToWithValue(fiplab.arguments.from, fiplab.arguments.to, fiplab.arguments.value);
    if(resp == -1){
      fiplab.exit(resp.error, false);
      return;
    }

    let str = resp.toFixed(2);
    fiplab.exit(str, true);
  } 
  catch(err){
    console.error(err.toString());
    fiplab.exit('Invalid server response', false);
  }
})
.catch(function(err){
  console.error(err.toString());
  fiplab.exit('Invalid server response', false);
});