const fiplab = require('fiplab');
const ZendeskAPI = require('./ZendeskAPI');

class ZenDesk{
  run(){
      this._requestTicketCount();
  }

  _requestTicketCount(){
    let email = fiplab.arguments.email;
    let token = fiplab.arguments.token;

    this.api = new ZendeskAPI(email, token);
    this.api.getTicketCount()
    .then(this._handleResponse.bind(this))
    .catch(function(err){
      fiplab.exit(err.toString(), false);
    });
  }

  _handleResponse(json){
    fiplab.exit(json.count.toFixed(), true);
  }
}

//Run it
let app = new ZenDesk();
app.run();
