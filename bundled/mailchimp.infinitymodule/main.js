const fiplab = require('fiplab');
const MailChimpAPI = require('mailchimp').MailChimpAPI;

try {
  let api = new MailChimpAPI(fiplab.arguments.apiKey, {version : '2.0'});
  let options = { 
    id: fiplab.arguments.listID,
  };

  api.call('lists', 'members', options, function (error, json) {
    try{
      let total = json.total;

      let numObj = new Number(total);
      let rawStr = numObj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      fiplab.exit(rawStr, true);
    } catch(error){
      console.error(error.toString());
      fiplab.exit('An error occurred while updating, please check your API and/or List ID then try again.', false);
    }
  });
} 
catch (error) {
  fiplab.exit(error.message, false);
}


