const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})

let url = 'https://www.instagram.com/' + fiplab.arguments.username;

nightmare
.goto(url)
.wait('header ul li span > span')
.evaluate(function(){
  let valueElems = document.querySelectorAll('header ul li span > span');
  if(!valueElems){
    return false;
  }
  //Follows
  let follows = valueElems[1];

  if(follows){
    follows = follows.innerText;
  }
  else{
    follows = 0;
  }

  return {
    'follows': follows
  };
})
.end()
.then(function(value){
  console.log(value);

  if(value === false){
    fiplab.exit('Invalid response while processing', false);
  }
  else{
    fiplab.exit(value.follows, true);
  }
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
