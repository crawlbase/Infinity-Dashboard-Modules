const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 2000
})

nightmare
.goto('https://appfigures.com/itcstatus')
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
