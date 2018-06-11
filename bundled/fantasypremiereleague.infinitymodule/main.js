let fiplab = require('fiplab');
let request = require('request');
let util = require('util');

let arguments = fiplab.arguments;

let urlFormat = 'https://fantasy.premierleague.com/drf/entry/%s';
let options = {
  'url': util.format(urlFormat, arguments.playerID)
}

let parseJSONResponse = function(json){
  try{
    let points = json.entry.summary_event_points;
    let numObj = new Number(points);
    let rawStr = numObj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    fiplab.exit(rawStr, true);
  } catch(exception){
    console.error(json);
    fiplab.exit('Invalid response from the server.', false);
  }
}

let callback = function(error, resp, body){
  //Validate the response
  if(resp.statusCode == 404){
    fiplab.exit('Invalid Player ID.', false);

  }
  else if(resp.statusCode != 200){
   fiplab.exit('Invalid response from server', false);
  }
  try{
    let json = JSON.parse(body);
    parseJSONResponse(json);
  } catch(exception){
    fiplab.exit(exception.toString(), false);
  }
};

request(options, callback);