const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})


nightmare
.goto('https://www.strava.com/athlete/fitness')
.insert('input[name=email]', fiplab.arguments.email)
.insert('input[name=password]', fiplab.arguments.password)
.click('#login-button')
.wait('.fitness-dot')
.evaluate(function(){
  let failedAlert = document.querySelector('.alert-message');
  if(failedAlert){
    console.warn(failedAlert.innerText);
    return false;
  }

  let fitness = document.querySelector('#ff-fitness').innerText.trim();
  let fatigue = document.querySelector('#ff-freshness').innerText.trim();
  let form = document.querySelector('#ff-form').innerText.trim();
  return fitness + ' - ' + fatigue + ' (' + form + ')';
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Invalid response while processing', false);
  }
  else{
    fiplab.exit(value, true);
  }
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
