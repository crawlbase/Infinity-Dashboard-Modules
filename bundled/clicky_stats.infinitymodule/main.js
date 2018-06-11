const fiplab = require('fiplab');
const ClickyStats = require('./ClickyStats');

let formatNumberString = function(input){
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let options = {
  username: fiplab.arguments.username,
  password: fiplab.arguments.password,
  siteID: fiplab.arguments.siteID
}

let clicky = new ClickyStats(options);
clicky.getStats()
.then(function(stats){
  let display = fiplab.arguments.display;

  let unique = formatNumberString(stats.unique);
  let bounce = formatNumberString(stats.bounce) + '%';

  let returnStr = '';

  if(display === 'both'){
    returnStr = unique + ' (' + bounce + ')';
  }
  else if(display === 'unique'){
    returnStr = unique;
  }
  else if(display === 'bounce'){
    returnStr = bounce;
  }

  fiplab.exit(returnStr, true);
})
.catch(function(err){
  fiplab.exit(err.toString(), false);
});