const request = require('request');
class BTCPriceUpdater{
  constructor(currencyCode){
    this.currency = currencyCode;
  }

  //Current Price
  update(){
    let promise = new Promise(this._actuallyUpdate.bind(this));
    return promise;
  }

  _actuallyUpdate(resolve, reject){
    let url = 'https://api.coindesk.com/v1/bpi/currentprice/' + this.currency + '.json';

    request(url, this._handleCurrencyResponse.bind(this, resolve, reject));
  }

  _handleCurrencyResponse(finalResolve, finalReject, err, resp, body){
    try{
      let json = JSON.parse(body);

      let rate = json.bpi[this.currency].rate_float;
      rate = (Math.round(rate * 100) / 100);
      finalResolve(rate);
    } catch(exception){
      console.error(exception.toString());
      finalReject('Invalid Server Response');
    }
  }

  //History
  getHistory(){
    let promise = new Promise(this._actuallyGetHistory.bind(this));
    return promise;
  }
  _actuallyGetHistory(resolve, reject){
    let url = 'https://api.coindesk.com/v1/bpi/historical/close.json?currency=' + this.currency + '&for=yesterday';

    request(url, this._handleHistoryResponse.bind(this, resolve, reject));
  }

  _handleHistoryResponse(finalResolve, finalReject, err, resp, body){
    try{
      let json = JSON.parse(body);
      let obj = json.bpi;

      //Get the first item in the list
      let rate = obj[Object.keys(obj)[0]];
      rate = (Math.round(rate * 100) / 100);

      finalResolve(rate);
    } catch(exception){
      console.error(exception.toString());
      finalReject('Invalid Server Response');
    }
  }


}

module.exports = BTCPriceUpdater;