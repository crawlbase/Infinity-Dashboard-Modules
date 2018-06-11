const request = require('request');
const moment = require('moment');

class FitBitAPI{
  constructor(token){
    this.token = token; 
  }
  getWeightData(units){
     let promise = new Promise(this._actuallyGetWeightData.bind(this, units));
    return promise;
  }

  getActivityData(){
    let promise = new Promise(this._actuallyActivityData.bind(this));
    return promise;
  }
  _actuallyGetWeightData(units, resolve, reject){
    let date = moment().format('YYYY-MM-DD');

    let lang = 'en_US';
    if(units == 'metric'){
      lang = 'METRIC';
    }

    request({
      url: 'https://api.fitbit.com/1/user/-/body/log/weight/date/' + date + '/1m.json',
      headers: {
        'Authorization': 'Bearer ' + this.token.access_token,
        'Accept-Language': lang
      }
    }, function(err, resp, body){
      console.log(resp.statusCode);
      if(resp.statusCode != 200){
        console.error(body);
        reject('Invalid response from server');
        return;
      }

      try{
        let json = JSON.parse(body);
        resolve(json);
      } 
      catch(err){
        reject(err);
      }
    });
  }

  _actuallyActivityData(resolve, reject){
    let date = moment().format('YYYY-MM-DD');

    request({
      url: 'https://api.fitbit.com/1/user/-/activities/date/' + date + '.json',
      headers: {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    }, function(err, resp, body){
      console.log(resp.statusCode);
      if(resp.statusCode != 200){
        console.error(body);
        reject('Invalid response from server');
        return;
      }

      try{
        let json = JSON.parse(body);
        resolve(json);
      } 
      catch(err){
        reject(err);
      }
    });
  }

}

module.exports = FitBitAPI;