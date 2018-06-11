const request = require('request');

class ExchangeRateUpdater{
  update(){
    let promise = new Promise(this._actuallyUpdate.bind(this));
    return promise;
  }

  _actuallyUpdate(resolve, reject){
    let that = this;
    let url = 'http://www.imf.org/external/np/fin/data/rms_five.aspx?tsvflag=Y';

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
    console.log('body', body);
    let lines = body.split("\n");
    let hasStartedCulling = false;
    let isDone = false;

    let rates = {};

    lines.forEach(function(line){
      if(isDone){
        return;
      }

      line = line.trim();
      if(!line.length){
        return;
      }

      if(!hasStartedCulling){
        if(line.startsWith('Currency')){
          hasStartedCulling = true;
        }
        return;
      }

      if(line.startsWith('Currency')){
        isDone = true;
        return;
      }

      let fields = line.split("\t");

      let currencyName = fields[0];

      let value = 0.0;

      for(var i = 1; i < fields.length; i++){
        let field = fields[i];
        if(field.length){
          value = parseFloat(field);
          break;
        }
      }

      rates[currencyName.toLowerCase()] = value;
    });

    return rates;
  }
}

module.exports = ExchangeRateUpdater;