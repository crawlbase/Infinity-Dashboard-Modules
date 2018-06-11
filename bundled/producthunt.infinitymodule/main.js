const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})

let url = fiplab.arguments.url;

nightmare
.goto(url)
.wait('main')
.evaluate(function(){
  let getStringWithXPath = function(xPath){
    let value = document.evaluate(xPath, document, null, XPathResult.STRING_TYPE, null);
    return value.stringValue.trim();
  };

  let count = getStringWithXPath('//span[contains(@class,"bigButtonCount")]/text()');
  if(!count.length){
    return false;
  }

  return count;
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
