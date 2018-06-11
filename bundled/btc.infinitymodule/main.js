const fiplab = require('fiplab');
const currencyFormatter = require('currency-formatter');
const BTCPriceUpdater = require('./BTCPriceUpdater');

class FIPLABModule{
  constructor(){
    this.currencyCode = fiplab.arguments.currency;
    this.updater = new BTCPriceUpdater(this.currencyCode);
  }

  run(){
    this.updater.update()
    .then(this._handleResponse.bind(this))
    .catch(function(err){
      fiplab.exit(err.toString(), false);
    });
  }

  _handleResponse(rate){    
    //Save the current rate
    this.currentRate = rate;

    //Get yesterdays price
    this.updater.getHistory()
    .then(this._handleHistoryResponse.bind(this))
    .catch(function(err){
      fiplab.exit(err.toString(), false);
    });
      }

  _handleHistoryResponse(yesterdaysRate){
    this.yesterdaysRate = yesterdaysRate;

    let returnOptions = this._returnOptions();
    fiplab.exit(returnOptions.string, true, returnOptions.options);
  }

  _returnOptions(){
    let rate = this.currentRate;
    let yesterdaysRate = this.yesterdaysRate;
    let currencyCode = this.currencyCode;

    let displayArg = fiplab.arguments.display;
    let rateString = currencyFormatter.format(rate, {'code': currencyCode});

    if(displayArg === 'currentPrice'){
      return {
        'string': rateString,
        'options': {}
      };
    }

    //No item
    if(!yesterdaysRate || (rate == yesterdaysRate)){
      return {
        'string': rateString,
        'options': {}
      }
    }

    //Determine the colors to show
    let color = '#000000';
    let prefix = '';

    if(rate != yesterdaysRate){
      let isUp = (rate > yesterdaysRate);

      prefix = isUp ? '▲ ' : '▼ ';
      color = isUp ? '#149839' : '#FD3641'
    }

    //If we're just showing the price change then return now
    if(displayArg === 'currentAndPriceDiff'){
      let diff = (rate - yesterdaysRate);
      let changeString = currencyFormatter.format(diff, {'code': currencyCode});
      return {
        'string': prefix + rateString + ' (' + changeString + ')',
        'options': {
          'color': color
        }
      }
    }

    if(displayArg === 'currentAndYesterday'){
      let changeString = currencyFormatter.format(yesterdaysRate, {'code': currencyCode});
      return {
        'string': prefix + rateString + ' (' + changeString + ')',
        'options': {
          'color': color
        }
      }
    }

    //Calculate the price increase/decrease
    let percent = ((rate - yesterdaysRate) / yesterdaysRate);
    percent = (percent * 100).toFixed(0);

    return {
      'string': prefix + rateString + ' (' + percent + '%)',
      'options': {
        'color': color
      }
    }
  }
}

let fiplabModule = new FIPLABModule();
fiplabModule.run();