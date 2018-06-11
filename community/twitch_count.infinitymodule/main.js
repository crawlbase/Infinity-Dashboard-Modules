const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({show: false})

let url = fiplab.arguments.url;

if(url.indexOf('twitch.tv') == -1){
  fiplab.exit('Please enter a valid Twitch url.', false);
  return;
}

nightmare
.goto(url)
.wait('.tw-stat__value')
.evaluate(function(){
  let elem = document.querySelector('.tw-stat__value');
  if(!elem){
    return false;
  }

  let count = elem.innerText.trim();
  if(!count.length){
    return false;
  }
  return count;
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Offline', false);
    return;
  }

  fiplab.exit(value, true);  
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
