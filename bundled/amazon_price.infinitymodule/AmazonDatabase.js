const moment = require('moment');

class AmazonDatabase{
  constructor(db){
    this.db = db;

    //
    this._setupDefaults();
  }

  /** Public Methods */
  firstRecordedItem(){
    let item = this.db.get('prices[0]');
    if(!item.size().value()){
      return null;
    }

    return item.value();
  }

  lastRecordedPriceChange(){
    let now = moment().format('YYYY-DD-MM');
    
    //Get the current price value
    let latestPrice = this._existingItemWithDate(now);
    if(!latestPrice){
      return null;
    }

    latestPrice = latestPrice.value();

    //Find the last price change
    let lastChange = this.db.get('prices')
    .orderBy('date', 'desc')
    .find(function(obj){
      //Ignore any null/invalid prices
      if(!obj.current_price){
        return false;
      }

      return obj.current_price !== latestPrice.current_price;
    });

    if(!lastChange.size().value()){
      return null;
    }

    return lastChange.value();
  }

  formattedPriceObj(priceObj){
    let obj = Object.assign({}, priceObj);

    //Check to see if there is a current price
    if(!obj.current_price.trim().length){
      return null;
    }

    obj.currency = obj.current_price.replace(/[0-9\.-]+/g,'');
    obj.current_price = this._floatFromPriceString(obj.current_price);
    obj.original_price = this._floatFromPriceString(obj.original_price);
    obj.savings_price = this._floatFromPriceString(obj.savings_price);

    return obj;
  }
  
  _priceObjectIsValid(priceObj){
    if(typeof(priceObj.currency) !== 'string'){
      return false;
    }

    if(typeof(priceObj.current_price) !== 'string'){
      return false;
    }

    return true;
  }

  addPriceToDatabase(priceObj){
    let obj = this.formattedPriceObj(priceObj);

    if(!obj || !this._priceObjectIsValid(obj)){
      return false;
    }

    let now = moment().format('YYYY-DD-MM');
    obj.date = now;

    let existingItem = this._existingItemWithDate(now);

    //Update the price of the existing item if there is one
    if(existingItem){
      existingItem.assign(obj).write();
    }
    else{
    //Add the new line
    this.db.get('prices').push(obj).write();
  }  

    
    return true;
  }

  /** Private Methods */
  _setupDefaults(){
    let defaults = { 
      prices: []
    };

    this.db.defaults(defaults).write();
  }

  _floatFromPriceString(priceString){
    if(!priceString){
      return null;
    }

    return parseFloat(priceString.replace(/[^0-9\.-]+/g, '')).toFixed(2);
  }

  _existingItemWithDate(date){
    let elem = this.db.get('prices').find(function(obj){
      return obj.date == date;
    });

    if(!elem.size().value()){
      return null;
    }

    return elem;
  }
};

module.exports = AmazonDatabase;

