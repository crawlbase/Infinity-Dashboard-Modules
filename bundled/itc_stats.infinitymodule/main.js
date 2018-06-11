const fiplab = require('fiplab');
const iTunesConnect = require('./iTunesConnect');

let app = new iTunesConnect(fiplab.arguments);

app.update()
.then(function(result){
  fiplab.exit(result, true);
})
.catch(function(err){
  console.error('Got error while updating:', err.toString());

  let errorString = err.toString();
  if(!errorString){
    errorString = 'An error occurred while updating the total.';
  }
  
  fiplab.exit(errorString, false);
});