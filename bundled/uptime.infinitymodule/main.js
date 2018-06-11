const fiplab = require('fiplab');
const os = require('os');
const moment = require("moment");
require("moment-duration-format");

//Config
let uptime = os.uptime();
let format = 'd[d] H[h]';

//Narrow down the output format
//If it's less than a day then just show hours
if(uptime < 86400){

  //If it's less than an hour just show mins and secs.
  if(uptime < 3600){
    format = 'm[m] s[s]';
  }
  else{
    format = 'H[h] m[m]';    
  }
}

//Output it to the module
let outputString = moment.duration(uptime, 'seconds').format(format);
fiplab.exit(outputString, true);