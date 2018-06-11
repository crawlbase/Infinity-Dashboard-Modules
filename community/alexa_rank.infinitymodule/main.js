const fiplab = require('fiplab');
const request = require('request');

const xmlParseString = require('xml2js').parseString;

let url = 'http://data.alexa.com/data?cli=10&url=' + fiplab.arguments.url;

request(url, function(err, resp, body){
  if(resp.statusCode !== 200){
    fiplab.exit('Could not connect to Alexa', false);
    return;
  }
  
  if(body === 'Okay'){
    fiplab.exit('Country Not Supported', false);
    return;
  }

  xmlParseString(body, function (err, result) {
    try{
      let rank = result.ALEXA.SD[0].COUNTRY[0].$.RANK;
      fiplab.exit(rank.toString(), true);
    } 
    catch(err){
      console.error(err.toString());
      fiplab.exit('Could not parse xml', false);
    };
  });  
});
