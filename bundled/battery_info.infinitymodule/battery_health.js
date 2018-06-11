const {exec} = require('child_process');
let getBatteryHealthInfo = function(callback){
  let command = "/usr/sbin/ioreg -rc AppleSmartBattery | grep .*Capacity.* | cut -d' ' -f9";

  exec(command, function(err, result, stderr){
    try{
      const lines = result.match(/[^\n]+/g);
      let current = parseInt(lines[0], 10);
      let original = parseInt(lines[3], 10);
      let health = Math.round((current / original) * 100);
      health = health + '%';

      let obj = {
        'current': current + ' mAh',
        'original': original + ' mAh',
        'health': health
      };

      console.log(obj);
      callback(obj);
    }
    catch(e){
      console.error('No battery detected or an error occured');
      callback(null);
    }
  });
};

module.exports = getBatteryHealthInfo;