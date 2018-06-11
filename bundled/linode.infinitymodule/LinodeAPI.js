const request = require('request');

class LinodeAPI{
  constructor(token){
    this.token = token; 
  }

  getBandwidth(){
    let promise = new Promise(this._actuallyGetBandwidth.bind(this));
    return promise;
  }

  _actuallyGetBandwidth(resolve, reject){
    request({
      url: 'https://api.linode.com/v4/account/transfer',
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    }, function(err, resp, body){
      if(resp.statusCode == 401){
        console.info('Status Code:', resp.statusCode);
        console.info('Response Body:', body);
      
        reject('Invalid Personal Access Token. Please verify the token and scopes then try again.');
        return;
      }

      if(resp.statusCode != 200){  
        console.info('Status Code:', resp.statusCode);
        console.info('Response Body:', body);

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

module.exports = LinodeAPI;