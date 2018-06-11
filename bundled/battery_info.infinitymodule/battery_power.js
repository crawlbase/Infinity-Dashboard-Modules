const powerInfo = require('node-power-info');

let getPowerInfo = function(callback){
  powerInfo.getDefault().then(provider => provider.getBatteries())
  .then(function(batteries){
    if(!batteries || !batteries.length){
      callback(null);
      return;
    }

    let battery = batteries[0];

    let level = battery.powerLevel;
    let timeRemaining = -1;

    if(battery.isTimeAvailable){
      let remainingMinutes = ('0' + battery.remainingTimeMinutes).slice(-2);
      let remainingTimeHours = battery.remainingTimeHours;

      if(remainingTimeHours){
        timeRemaining = remainingTimeHours + ':' + remainingMinutes;
      }
      else{
        timeRemaining = '00:' + remainingMinutes;
      }

      let obj = {
        'charge_level': level + '%',
        'time_remaining': timeRemaining
      };

      callback(obj);
    }
    else{
      let obj = {
        'charge_level': level + '%',
        'time_remaining': '---'
      };

      callback(obj);
    }
  })
  .catch(function(e){
    console.error(e.toString());
    let obj = {
      'charge_level': '0%',
      'time_remaining': '---'
    };

    callback(obj);
  });
}

module.exports = getPowerInfo;