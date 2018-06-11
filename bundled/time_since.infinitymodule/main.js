let fiplab = require('fiplab');
let arguments = fiplab.arguments;
console.log(arguments);

const moment = require('moment');
const countdown = require('countdown');
countdown.setLabels(
  'ms|s|m|h|d|w|mo|y',
  'ms|s|m|h|d|w|mo|y',
  ' ', ' ');
require('moment-countdown');

const FLOutputFormat = {
  HHMMSS: 0,
  DDHHMM: 1,
  WWDDHH: 2,
  MOWWDD: 3,
  YYWWDD: 4
};


function getTimeRemaining(dateStr, format){
  let then = moment(dateStr, 'YYYY-MM-DD hh:mm:ss');
  if(!then){
    return null;
  }

  let now = moment();
  let t = then.diff(now);

  if(t > 0){
    return -1;
  }

  let formatVal = 0;

  switch(format){
    default:
    case FLOutputFormat.HHMMSS:
    formatVal = countdown.HOURS | countdown.MINUTES | countdown.SECONDS;
    break;

    case FLOutputFormat.DDHHMM:
    formatVal = countdown.DAYS | countdown.HOURS | countdown.MINUTES;
    break;

    case FLOutputFormat.WWDDHH:
    formatVal = countdown.WEEKS | countdown.DAYS | countdown.HOURS;
    break;

    case FLOutputFormat.MOWWDD:
    formatVal = countdown.MONTHS | countdown.DAYS | countdown.HOURS;
    break;

    case FLOutputFormat.YYWWDD:
    formatVal = countdown.YEARS | countdown.WEEKS | countdown.DAYS;
    break;
  }


  return now.countdown(then, formatVal).toString();
}

//Calc
let remaining = getTimeRemaining(arguments.date, arguments.display);
if(remaining == -1){
  fiplab.exit('🔮 This date is in the future.', false);
  return;
}

if(!remaining){
  fiplab.exit('Invalid input date', false);
}
else{
  fiplab.exit(remaining, true);
}
