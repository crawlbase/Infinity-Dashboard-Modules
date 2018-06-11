const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})

let url = 'https://stackoverflow.com/users/' + fiplab.arguments.userID

let formatNumberString = function(input){
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

nightmare
.goto(url)
.wait('body')
.evaluate(function(){
  let reputationElem = document.querySelector('#avatar-card .reputation');
  if(!reputationElem){
    return false;
  }

  let reputation = reputationElem.innerText.trim();
  reputation = parseInt(reputation.replace(/[^0-9\.-]+/g, ''), 10);

  return {
    'reputation': reputation,
  }
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Invalid response while processing', false);
  }
  else{
    let rep = value.reputation.toString();
    rep = formatNumberString(rep);

    fiplab.exit(rep, true);
  }
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
