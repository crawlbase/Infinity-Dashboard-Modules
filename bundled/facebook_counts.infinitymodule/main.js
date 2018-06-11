const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
})

let displayAs = fiplab.arguments.display;
let url = 'https://www.facebook.com/pg/' + fiplab.arguments.username + '/community/?ref=page_internal&mt_nav=0';

nightmare
.goto(url)
.wait('div._3xom')
.evaluate(function(){
  let valueElems = document.querySelectorAll('div._3xom');
  if(!valueElems){
    return false;
  }

  //Likes
  let likes = valueElems[0];
  if(likes){
    likes = likes.innerText;
  }
  else{
    likes = 0;
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
    'likes': likes,
    'follows': follows
  };
})
.end()
.then(function(value){
  if(value === false){
    fiplab.exit('Invalid response while processing', false);
  }
  else{
    let returnVal = value.likes;

    if(displayAs == 'follows'){
      returnVal = value.follows;
    }
    else if(displayAs == 'both'){
      returnVal += ' (' + value.follows + ')';
    }

    fiplab.exit(returnVal, true);
  }
})
.catch(error => {
  fiplab.exit(error.toString(), false);
});
