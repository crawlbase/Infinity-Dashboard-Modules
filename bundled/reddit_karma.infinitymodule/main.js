const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})

let url = 'https://www.reddit.com/user/' + fiplab.arguments.username;

nightmare
.goto(url)
.wait('body')
.evaluate(function(){
  let getStringWithXPath = function(xPath){
    let value = document.evaluate(xPath, document, null, XPathResult.STRING_TYPE, null);
    value = value.stringValue.trim();
    return value;
  };

  let karma = document.querySelector('.karma');
  if(!karma){
    karma = document.querySelector('.ProfileSidebar__karma');
  }

  if(!karma){
    return false;
  }

  //Get the text
  karma = karma.innerText;
  //Remove any additional spaces
  karma = karma.trim();
  //Remove all non-digit values
  karma = karma.replace(/[^0-9\.-]+/g, '');
  //Format the number with commas
  karma = karma.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
