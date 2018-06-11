const fiplab = require('fiplab');
const request = require('request');

let callback = function(error, resp, body){
  if(resp.statusCode != 200){
    fiplab.exit('Server Error', false);
    return;
  }

  //
  try{
    let json = JSON.parse(body);
    fiplab.exit(json.ip, true);
  } catch(e){
    fiplab.exit('Could not connect to ipify', false);
  }
};

request('https://api.ipify.org?format=json', callback);