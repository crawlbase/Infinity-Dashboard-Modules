let fiplab = require('fiplab');
let request = require('request');
let util = require('util');

let arguments = fiplab.arguments;

let returnType = arguments.returnType;

let urlFormat = 'http://api.openweathermap.org/data/2.5/weather?q=%s&units=%s&appid=%s';
let options = {
  'url': util.format(urlFormat, arguments.cityName, arguments.units, arguments.apiKey)
}


function getEmojiWithJSON(json){
  let emojiMap = {
    "default": '😢',
    "thunderstorm": "⛈",
    "drizzle": "🌧",
    "rain": "☔️",
    "snowflake": "❄️",
    "snowman": "⛄️",
    "atmosphere": "🌫",
    "clearSky": "☀️",
    "fewClouds": "🌤",
    "clouds": "☁️",
    "hot": "🔥",
  }

  let returnKey = 'default';

  try{
    let id = json.weather[0].id;
    let weatherID = id.toString();
    let firstChar = weatherID[0];

    console.log(weatherID, firstChar);

    if(firstChar == '2' || weatherID == '900' || weatherID == '901' || weatherID == '902' || weatherID == '905'){
      returnKey = 'thunderstorm';
    }
    else if(firstChar == '3'){
      returnKey = 'drizzle';
    }
    else if(firstChar == '5'){
      returnKey = 'rain';
    }
    else if(firstChar == '6' || weatherID == '903' || weatherID == '906'){
      returnKey = 'snowflake';
    }
    else if(firstChar == '7'){
      returnKey = 'atmosphere';
    }
    else if(weatherID == '800'){
      returnKey = 'clearSky';
    }
    else if(weatherID == '801'){
      returnKey = 'fewClouds';
    }
    else if(weatherID == '802' || weatherID == '803' || weatherID == '804'){
      returnKey = 'clouds';
    }
    else if(weatherID == '904'){
      returnKey = 'hot';
    }
  } catch(e){
    console.error(e);
  }

  return emojiMap[returnKey];
}

let parseJSONResponse = function(json){
  try{
    let returnString = '';

    console.log(json);

    let weatherObj = json.weather[0];
    let weatherDesc = weatherObj.main;
    let temperature = Math.ceil(json.main.temp) + '°';
    let emoji = getEmojiWithJSON(json);

    let useIcon = fiplab.arguments.useIcon;

    if(useIcon){
      weatherDesc = emoji;
    }

    if(returnType == 'weather'){
      returnString = weatherDesc;
    }
    else if(returnType == 'both'){
      returnString = temperature;
      if(useIcon){
        returnString += ' ' + weatherDesc;
      }
      else{
        returnString += ' - ' + weatherDesc;
      }
    }
    else{
      returnString = temperature;
    }

    fiplab.exit(returnString, true);
  } catch(exception){
    console.error(json);
    fiplab.exit('Invalid response from the server.', false);
  }
}

let callback = function(error, resp, body){
  //Validate the response
  if(resp.statusCode == 401){
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