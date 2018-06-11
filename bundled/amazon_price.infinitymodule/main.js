const fiplab = require('fiplab');

const AmazonPriceChecker = require('./AmazonPriceChecker');
const AmazonDatabase = require('./AmazonDatabase');
const moment = require('moment');

class Amazon{
  constructor(){
    this.priceUpdater = new AmazonPriceChecker(fiplab.arguments.url);
    this.db = new AmazonDatabase(fiplab.db);
  }

  run(){
    //Validate the Specified URL is an Amazon URL
    if(!this.priceUpdater.isValidAmazonURL()){
      fiplab.exit('Could not determine the Product ID from the URL.', false);
      return;
    }

    //Update the price
    this.priceUpdater.updatePrice()
    .then(this._handlePriceUpdate.bind(this))
    .catch(this._handlePriceFailure.bind(this));
  }

  /** Private Price Change Methods **/
  _handlePriceUpdate(priceObj){
    if(!this.db.addPriceToDatabase(priceObj)){
      console.warn('The price object is missing some required information', priceObj);
      fiplab.exit('Invalid response from server', false);
      return;
    }

    // console.log('Last', this.db.lastRecordedPriceChange());
    // console.log('First', this.db.firstRecordedItem());
    // console.log('Price update', priceObj);

    let returnOptions = this._returnOptionsWithObj(priceObj);

    fiplab.exit(returnOptions.string, true, returnOptions.options);
  }

  _handlePriceFailure(error){
    fiplab.exit(error.toString(), false);
  }

  /** Private Helpers **/
  _returnOptionsWithObj(obj){
    let displayArg = fiplab.arguments.display;

    if(displayArg === 'currentPrice'){
      return {
        'string': obj.current_price,
        'options': {}
      };
    }

    let priceObj = this.db.formattedPriceObj(obj);

    //Determine which price change item we're using
    let changeVal = fiplab.arguments.priceChange;
    let priceChangeObj = null;

    if(changeVal === 'firstPrice'){
      priceChangeObj = this.db.firstRecordedItem();
    }
    else if(changeVal === 'lastPrice'){
      priceChangeObj = this.db.lastRecordedPriceChange();
    }

    //No item
    if(!priceChangeObj || (priceObj.current_price == priceChangeObj.current_price)){
      return {
        'string': obj.current_price,
        'options': {}
      }
    }


    let currentPrice = parseFloat(priceObj.current_price);
    let change = parseFloat(priceChangeObj.current_price);

    //Determine the colors to show
    let color = '#000000';
    let prefix = '';

    if(currentPrice != change){
      let isUp = (currentPrice > change);

      prefix = isUp ? '▲ ' : '▼ ';
      color = isUp ? '#FD3641' : '#149839';
      
      //Show a notification if needed
      let notificationPreference = fiplab.arguments.notification;

      if(notificationPreference !== 'none'){
        let priceString = obj.current_price;

        let changeString = isUp ? 'increase' : 'decrease';
        let notificationID = priceString + '_' + changeString + '_' + moment().format('MM_D_YYYY');

        if(notificationPreference === 'any'){
          fiplab.notify({
            'id': notificationID,
            'message': 'The price is now ' + priceString
          });
        }
        else if(notificationPreference === 'increases'){
          if(isUp){
            fiplab.notify({
              'id': notificationID,
              'message': 'The price has increased to ' + priceString
            });
          }
        }
        else if(notificationPreference === 'decreases'){
         if(!isUp){
            fiplab.notify({
              'id': notificationID,
              'message': 'The price has decreased to ' + priceString
            });
          }
        }
      }
    }

    //If we're just showing the price change then return now
    if(displayArg === 'currentAndPriceDiff'){
      return {
        'string': prefix + obj.current_price + ' (' + priceChangeObj.currency + priceChangeObj.current_price + ')',
        'options': {
          'color': color
        }
      }
    }

    //Calculate the price increase/decrease
    let percent = ((currentPrice - change) / change);
    percent = (percent * 100).toFixed(0);

    return {
      'string': prefix + obj.current_price + ' (' + percent + '%)',
      'options': {
        'color': color
      }
    }
  }
};

//Run the code
let amazon = new Amazon();
amazon.run();
