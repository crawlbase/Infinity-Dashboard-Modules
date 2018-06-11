const fiplab = require('fiplab');
const stripe = require('stripe')(fiplab.arguments.key);
const currencyFormatter = require('currency-formatter');


stripe.balance.retrieve()
.then(function(balance) {
  try{
    let keys = ['available', 'pending'];
    let total = 0;
    let currency = 'USD';

    keys.forEach(function(key){
      let obj = balance[key];
      if(!obj){
        return;
      }

      //Tally all the balances together
      obj.forEach(function(balanceObj){
        total += balanceObj.amount;
        currency = balanceObj.currency.toUpperCase();
      });
    });

    //Convert the value from Stripe to dollars
    //Since it's in cents
    let dollars = 0;
    if(total > 0){
      dollars = (total / 100);
    }

    let rateString = currencyFormatter.format(dollars, {'code': currency});

    fiplab.exit(rateString, true);
  } 
  catch(err){
    console.error(err);
    fiplab.exit(err.toString(), false);
  }
}).catch(function(err) {
  fiplab.exit(err.toString(), false);
});
