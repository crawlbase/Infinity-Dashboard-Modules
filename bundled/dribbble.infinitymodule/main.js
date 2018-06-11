const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})

let url = fiplab.arguments.url;

if(url.indexOf('dribbble.com') == -1){
  fiplab.exit('The URL does not appear to be a valid dribbble.com link', false);
  return;
}

nightmare
.goto(fiplab.arguments.url)
.wait('body')
.evaluate(function(){

  let isProfile = document.querySelector('body#profile') ? true : false;

  let returnObj = {
    'count': '0'
  };

  if(isProfile){
    let countElem = document.querySelector('.full-tabs li.followers span.count');;
    if(countElem){
      returnObj = {
        'count': countElem.innerText.trim()
      }
    }
  }
  else{
    let countElem = document.querySelector('.shot-stats .likes-count');
    if(countElem){
      let label = countElem.querySelector('.stats-num-label');
      if(label){
        countElem.removeChild(label);
      }

      let countVal = countElem.innerText.trim();
      returnObj = {
        'count': countVal
      }
    }
  }

  return returnObj;
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Invalid response while processing', false);
  }
  else{
    fiplab.exit(value.count, true);
  }
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
