const request = require('request');
const xmlParseString = require('xml2js').parseString;

class ExchangeRateUpdater{
  update(){
    let promise = new Promise(this._actuallyUpdate.bind(this));
    return promise;
  }

  _actuallyUpdate(resolve, reject){
    let that = this;
    let url = 'https://rss.timegenie.com/forex2.xml';

    request(url, function(err, resp, body){
      if(resp.statusCode != 200){
        reject('Invalid response from server');
        return;
      }

      try{
        let rates = that._parseResponse(body);
        resolve(rates);
      } catch(err){
        reject(err);
      }
    });
  }

  _parseResponse(body){
    let rates = {};

    xmlParseString(body, function (err, result) {
      let currencies = result.forex.data[0].currency;
      currencies.forEach(function(obj){
        let val = obj.$;
        rates[val.code] = parseFloat(val.rate);
      });
    });

    return rates;
  }
}

module.exports = ExchangeRateUpdater;