const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({show: false})

let url = fiplab.arguments.url;

if(url.indexOf('bit.ly') == -1 && url.indexOf('bitly.com') == -1){
  fiplab.exit('Please enter a bitly link.', false);
  return;
}

if(!url.endsWith('+')){
  url += '+';
}

nightmare
.goto(url)
.wait('.info-wrapper--user-clicks .info-wrapper--clicks-text')
.evaluate(function(){
  let elem = document.querySelector('.info-wrapper--user-clicks .info-wrapper--clicks-text');
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
    fiplab.exit('Could not get count', false);
    return;
  }

  fiplab.exit(value, true);  
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
