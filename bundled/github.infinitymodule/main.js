const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})


nightmare
.goto(fiplab.arguments.url)
.wait('body')
.evaluate(function(){
  let getStringWithXPath = function(xPath){
    let value = document.evaluate(xPath, document, null, XPathResult.STRING_TYPE, null);
    value = value.stringValue.trim();
    return value;
  };

  let stars = getStringWithXPath('//a[contains(@href,"stargazers")]/text()');
  if(!stars.length){
    stars = 0;
  }

  let issues = getStringWithXPath('//span[contains(text(),"Issues")]/following-sibling::span/text()');
  if(!issues.length){
    issues = 0;
  }

  return {
    'stars': stars,
    'issues': issues,
  }
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Invalid response while processing', false);
  }
  else{
    let display = fiplab.arguments.display;

    let returnString = '';
    if(display == 'stars'){
      returnString = value.stars;
    }
    else if(display == 'issues'){
      returnString = value.issues;
    }
    else{
      returnString = value.stars + ' (' + value.issues + ')';
    }

    fiplab.exit(returnString, true);
  }
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
