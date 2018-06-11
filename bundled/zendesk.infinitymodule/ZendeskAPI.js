const request = require('request');

class ZendeskAPI{
  constructor(username, token){
    this.username = username;
    this.token = token; 
  }

  getTicketCount(){
    let promise = new Promise(this._actuallyGetTicketCount.bind(this));

    return promise;
  }

  _actuallyGetTicketCount(resolve, reject){
    request({
      url: 'https://fiplab.zendesk.com/api/v2/search.json?query=type:ticket status:open&per_page=1',
      auth: {
        'user': this.username + '/token',
        'pass': this.token,
      }
    }, 
    function(err, resp, body){
      if(resp.statusCode == 401){
        console.info('Status Code:', resp.statusCode);
        console.info('Response Body:', body);
      
        reject('Invalid API Token. Please verify your email address and API Token then try again.');
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

module.exports = ZendeskAPI;