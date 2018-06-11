const ExchangeRateUpdater = require('./currency_exchange/ExchangeRateUpdater');
const CurrencyConvertor = require('./currency_exchange/CurrencyConvertor');
const currencyFormatter = require('currency-formatter');

const iTunesConnectUpdater = require('./iTunesConnectUpdater');

class ITC{
  constructor(options){
    this.options = options;
    this.itcUpdater = new iTunesConnectUpdater(options.userid, options.password);
  }
  update(){
    let promise = new Promise(this._startUpdate.bind(this));
    return promise;
  } 

  _startUpdate(resolve, reject){
    console.log('Getting iTunes Connect Data');
    
    this.itcUpdater.update()
    .then(this._handleITCUpdate.bind(this, resolve, reject))
    .catch(reject);
  }

  _handleITCUpdate(resolve, reject, data){
    console.log('r', data, typeof(data));

    //Are we displaying a message to the user?
    if(typeof(data) === 'string'){
      resolve(data);
      return;
    }
    
    if(!data){
      reject('Invalid Report Response');
      return;
    }

    this.reportData = data;
    console.log('Getting the latest currency rates');
    let exchangeRateUpdater = new ExchangeRateUpdater();
    exchangeRateUpdater.update()
    .then(this._handleExchangeRateUpdate.bind(this, resolve, reject))
    .catch(reject);
  }

  _handleExchangeRateUpdate(resolve, reject, rates){
    console.log('Calculating the totals and converting');

    let currencyConvertor = new CurrencyConvertor(rates);
    let currencyTotals = {};

    let outCurrency = 'USD'; //this.options.currency;

    //Calculate the totals for each currency
    let totalUnits = 0;

    this.reportData.forEach(function(obj){
      let currency = obj['Customer Currency'];
      let proceeds = parseFloat(obj['Developer Proceeds']);
      let units = parseInt(obj['Units']);

      totalUnits += units;

      let actualProceeds = (proceeds * units);
      
      if(!currencyTotals[currency]){
        currencyTotals[currency] = actualProceeds;
        return;
      }

      currencyTotals[currency] += actualProceeds;
    });
    
    //Convert each total into the user selected currency
    let outCurrencyTotal = 0;

    for(let key in currencyTotals){
      let price = currencyTotals[key];
      if(price == 0){
        continue;
      }

      let convertedValue = currencyConvertor.convertFromToWithValue(key, outCurrency, price);
      if(convertedValue !== -1){
        outCurrencyTotal += convertedValue;
      }
    }

    let rateString = currencyFormatter.format(outCurrencyTotal, {'code': outCurrency});
    resolve(rateString);
  }
}

module.exports = ITC;