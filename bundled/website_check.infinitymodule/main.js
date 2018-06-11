let fiplab = require('fiplab');
let request = require('request');

let options = fiplab.arguments;
let website = options.website;

let db = fiplab.db;
db.defaults({
  cache: []
}).write();

let callback = function(error, resp, body){
  let lastStatusItem = db.get('cache').find({website: website});
  lastStatusItem = lastStatusItem.value();
  
  let result = options.up;
  let status = 'up';

  if(error){
    result = options.down;
    status = 'down';
  }

  //If we have a previous item then we should show a notification
  if(lastStatusItem){
    let shouldNotify = (lastStatusItem.status && lastStatusItem.status != status);

    if(shouldNotify){
      let date = new Date();
      let dateString = date.getFullYear().toFixed() + date.getDate().toFixed() + date.getMonth().toFixed();
      let notificationID = website + status + dateString;

      //Generate the notification message
      let message = website + ' is ';

      if(status === 'down'){
        message = 'not reachable';
      }
      else{
        message = 'now reachable';
      }

      fiplab.notify({
        id: notificationID,
        message: message
      });
    }
  }

  //Remove all the previous entries
  db.get('cache').remove().write();
  db.get('cache').push({status: status, website: website}).write();

  fiplab.exit(result, true);
};

request({url: website}, callback);