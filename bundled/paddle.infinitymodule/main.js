const fiplab = require('fiplab');
const Nightmare = require('nightmare')
const nightmare = Nightmare({show: false})

nightmare
.goto('https://vendors.paddle.com')
.insert('input[name=email]', fiplab.arguments.email)
.insert('input[name=password]', fiplab.arguments.password)
.click('button.submit-button')
.wait('div.financial-stats')
.evaluate(function(){
  let stats = document.querySelectorAll('.balance-container div.financial-stats');
  let item = stats[1];
  let span = item.querySelector('span')
  span.parentElement.removeChild(span);

  return item.innerText.trim();
})
.end()
.then(function(value){
  fiplab.exit(value, true);
})
.catch(error => {
  fiplab.exit(null, false);
});