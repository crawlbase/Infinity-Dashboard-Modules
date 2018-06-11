let fiplab = require('fiplab');
const exec = require('child_process').exec;

const moment = require('moment');
const countdown = require('countdown');
countdown.setLabels(
  'ms|s|m|h|d|w|mo|y',
  'ms|s|m|h|d|w|mo|y',
  ' ', ' ');
require('moment-countdown');

let startAddress = '"' + fiplab.arguments.startAddress + '"';
let endAddress = '"' + fiplab.arguments.endAddress + '"';

let args = ["--from", startAddress, "--to", endAddress];

exec('./traveltime ' + args.join(' '), function callback(error, stdout, stderr){ 
  let resultString = stdout.trim();
  if(!resultString.length){
    if(stderr){
      fiplab.exit(stderr, false);
      return;
    }

    fiplab.exit('An error occurred while calculating the travel time', false);
    return;
  }

  let interval = parseInt(stdout, 10);
  let now = moment();
  let then = moment().add(interval, 'seconds');  
  let time = now.countdown(then, countdown.HOURS | countdown.MINUTES).toString();
  fiplab.exit(time, true);
});
