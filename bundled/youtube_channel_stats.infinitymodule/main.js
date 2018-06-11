let fiplab = require('fiplab');
let request = require('request');
let util = require('util');

let userArguments = fiplab.arguments;

let urlFormat = 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=%s&key=%s';
let options = {
  'url': util.format(urlFormat, userArguments.channelID, userArguments.apiKey)
}

let parseJSONResponse = function(json){
  try{
    let item = json.items[0];
    let stats = item.statistics;
    let count = stats[userArguments.display];

    let number = new Number(count);
    console.log(userArguments);
    fiplab.exit(number.toLocaleString(), true);

  } catch(exception){

    console.error(json);
    fiplab.exit('Invalid response from the server.', false);
  }
}

let callback = function(error, resp, body){
  //Validate the response
  if(resp.statusCode != 200){
    fiplab.exit('Invalid API Key.', false);
  }
  try{
    let json = JSON.parse(body);
    parseJSONResponse(json);
  } catch(exception){
    fiplab.exit(exception.toString(), false);
  }
};

request(options, callback);