const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({show: false})

let url = fiplab.arguments.url;

if(url.indexOf('pinterest.com') == -1){
  fiplab.exit('Please enter a valid Pinterest url.', false);
  return;
}

nightmare
.goto(url)
.wait('body')
.evaluate(function(){
  let elem = document.head.querySelector("[name='pinterestapp:followers']");
  if(!elem){
    return false;
  }

  return elem.content.trim();
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Invalid Profile Page.', false);
    return;
  }
  
  fiplab.exit(value, true);  
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
