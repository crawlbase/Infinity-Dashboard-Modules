let fiplab = require('fiplab');
let util = require('util');
let timezones = require('./timezones.json');
let moment = require('moment-timezone');

function timeZoneName(){
  let value = fiplab.arguments.timeZoneOption;
  let returnName = null;

  timezones.some(function(obj){
    if(obj.value == value){
      returnName = obj.utc[0];
      return true;
    }

    return false;
  });
  
  if(!returnName){
    returnName = 'GMT+0';
  }

  return returnName;
}

function getTimeWithTimeZoneName(zoneName){
  console.log('Zone', zoneName);
  let zone = moment().tz(zoneName);
  let format = fiplab.arguments.show24HourTime ? 'HH:mm' : 'hh:mm A';
  let result = zone.format(format);

  return result;
}

fiplab.exit(getTimeWithTimeZoneName(timeZoneName()), true);