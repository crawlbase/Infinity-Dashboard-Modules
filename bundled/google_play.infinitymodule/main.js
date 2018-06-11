const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 2000
})

let url = 'https://appfigures.com/playstatus';

if(fiplab.arguments.type == 'free'){
  url += '/free';
}
else{
  url += '/paid';
}

nightmare
.goto(url)
.wait('#banner.itc-success-banner-bg')
.evaluate(function(){
  return true;
})
.end()
.then(function(value){
  if(value === true){
   fiplab.exit('Released', true); 
 }
 else{
  fiplab.exit('Not Yet', true);
}
})
.catch(error => {
  fiplab.exit('Not Yet', true);
});
