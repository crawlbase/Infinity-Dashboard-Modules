const fiplab = require('fiplab');
const display = fiplab.arguments.display;

const getBatteryHealth = require('./battery_health');
const getBatteryPower = require('./battery_power');

let healthOptions = ['health', 'current', 'original'];

//Health options
if(healthOptions.indexOf(display) !== -1){
  getBatteryHealth(function(obj){
    if(!obj){
      fiplab.exit('No Battery Detected.', false);
      return;
    }
    
    console.info('Health Info', obj);
    
    try{
      let option = obj[display];
      fiplab.exit(option, true);
    }
    catch(e){
      console.error(e.toString());
      fiplab.exit('Could not get health information', false);
    }
  });
}
//Return battery power?
else{
  getBatteryPower(function(obj){
    if(!obj){
      fiplab.exit('No Battery Detected.', false);
      return;
    }

    console.info('Power Info', obj);

    try{
      let option = obj[display];
      fiplab.exit(option, true);
    }
    catch(e){
      console.error(e.toString());
      fiplab.exit('Could not get power information.', false);
    }
  });
}