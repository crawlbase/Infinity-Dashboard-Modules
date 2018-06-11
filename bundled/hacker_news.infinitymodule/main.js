const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})

let url = 'https://news.ycombinator.com/user?id=' + fiplab.arguments.username;

nightmare
.goto(url)
.wait('body')
.evaluate(function(){
  if(document.body.innerText === 'No such user.'){
    return false;
  }
  
  let getStringWithXPath = function(xPath){
    let value = document.evaluate(xPath, document, null, XPathResult.STRING_TYPE, null);
    value = value.stringValue.trim();
    return value;
  };

  let karma = getStringWithXPath('//td[contains(text(),"karma")]/following-sibling::td/text()');
  karma = karma.trim();

  if(!karma.length){
    karma = "0";
  }

  return {
    'karma': karma,
  }
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Invalid response while processing', false);
  }
  else{
    fiplab.exit(value.karma, true);
  }
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
