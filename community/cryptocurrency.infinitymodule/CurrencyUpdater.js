const request = require('request');
const currencyFormatter = require('currency-formatter');

class CurrencyUpdater{
  constructor(symbol, currency){
    this.symbol = symbol;
    this.currency = currency;
  }

  update(){
    let promise = new Promise(this._getListingID.bind(this));
    return promise;
  }

  _getListingID(resolve, reject){
    let symbol = this.symbol;

    let that = this;

    request('https://api.coinmarketcap.com/v2/listings/', function(err, resp, body){
      if(resp.statusCode !== 200){
        reject('Could not connect');
        return;
      }

      try{
        let json = JSON.parse(body);
        let data = json.data;

        //Locate the ID Object for the inputted currency
        let idObj = data.find(function(elem){
          if(elem.symbol == symbol){
            return true;
          }

          return false;
        });

        if(!idObj){
          reject('No currency found for symbol ' + symbol);
          return;
        }

        that._getPriceObject(idObj.id, resolve, reject);
      } 
      catch(err){
        console.error(err.toString());
        reject('Could not parse data');
      }
    });
  }

  _getPriceObject(listingID, resolve, reject){
    let currency = this.currency;
    let url = 'https://api.coinmarketcap.com/v2/ticker/' + listingID + '/?convert=' + currency;

    request(url, function(err, resp, body){
      if(resp.statusCode !== 200){
        reject('Could not connect');
        return;
      }
      try{
        let json = JSON.parse(body);
        let data = json.data;

        let currencyData = data.quotes[currency];
        let priceString = currencyFormatter.format(currencyData.price, {'code': currency});
        let priceChange =currencyData.percent_change_24h;

        let prefix = '';
        let color = '#000000';
        let suffix = '';
        if(priceChange.toFixed(0) !== '0'){
          prefix = (priceChange >= 0) ? '▲ ' : '▼ ';
          color = (priceChange >= 0) ? '#149839' : '#FD3641';
          suffix = ' (' + priceChange.toFixed(0) + '%)';
        }

        resolve({
          price: prefix + priceString + suffix,
          options: {
            color: color
          }
        });
      } 
      catch(err){
        console.error(err.toString());
        reject('Could not parse data');
      }
    });

  }
}

module.exports = CurrencyUpdater;