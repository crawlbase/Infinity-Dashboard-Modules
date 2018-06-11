const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})

console.log(fiplab.arguments);

let showCompressed = fiplab.arguments.showCompressed;
let url = 'https://twitter.com/' + fiplab.arguments.username;

nightmare
.goto(url)
.wait('a[data-nav="followers"]')
.evaluate(function(){
  let valueElem = document.querySelector('a[data-nav="followers"] span.ProfileNav-value');
  if(!valueElem){
    return false;
  }

  let countStr = valueElem.innerText;
  let countRaw = valueElem.getAttribute('data-count');
  countRaw = parseInt(countRaw, 10);

  let numObj = new Number(countRaw);
  let rawStr = numObj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return {
    'compressed': countStr,
    'raw': rawStr
  };
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Invalid response while processing', false);
  }
  else{
    let returnVal = value.raw;

    if(showCompressed){
      returnVal = value.compressed;
    }

    fiplab.exit(returnVal, true);
  }
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
