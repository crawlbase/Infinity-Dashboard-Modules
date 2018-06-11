let fiplab = require('fiplab');
let request = require('request');
let util = require('util');

let symbol = fiplab.arguments.symbol;

let urlFormat = 'https://api.iextrading.com/1.0/stock/%s/price';
let options = {
  'url': util.format(urlFormat, symbol)
}

let callback = function(error, resp, body){
  if(resp.statusCode != 200){
    fiplab.exit('Invalid Symbol', false);
    return;
  }

  fiplab.exit('$' + body, true);
};

request(options, callback);