const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  waitTimeout: 5000
});

class AmazonPriceChecker{
  constructor(url){
    this.url = url;
  }

  isValidAmazonURL(){
    let helpers = require('./helpers');
    let ASIN = helpers.extractASINFromURL(this.url);

    return ASIN ? true : false;
  }

  updatePrice(){
    let promise = new Promise(this._actuallyRun.bind(this));
    return promise;
  }

  _actuallyRun(resolve, reject){
    nightmare
    .goto(this.url)
    .wait('body')
    .evaluate(function(){
      let getStringWithXPath = function(xPath){
      let value = document.evaluate(xPath, document, null, XPathResult.STRING_TYPE, null);
        value = value.stringValue.trim();
        return value;
      };

      //Attempt to find the original price based on a number of keywords
      //Save these as an array and auto gen the xpath for it
      let keywords = ['List Price', 'Was','M.R.P','MRP','R.R.P','RRP','Print List Price','Price'];
      let contains = 'contains(text(), "' + keywords.join('") or contains(text(),"') + '")';

      let original_price = getStringWithXPath('//td[' + contains + ']/following-sibling::td/span/text()');
      if(!original_price.length){
        original_price = getStringWithXPath('//span[' + contains + ']/following-sibling::span/text()');
      }

      //Attempt to find the current price element
      let current_price = getStringWithXPath('//span[contains(@id,"ourprice") or contains(@id,"saleprice") or contains(@id,"dealprice")]/text()');

      //Some pages (books) don't have these elements so we'll look for the .offer-price value
      if(!current_price.length){
        current_price = getStringWithXPath('//span[contains(@class,"offer-price")]/text()');
      }

      //Determine if this price is a deal or not
      //Look for the deal price element
      let savingsElem = document.querySelector('#regularprice_savings td:last-child') || document.querySelector('#dealprice_savings td:last-child');
      let savingsRawStr = savingsElem ? savingsElem.innerText.trim() : '';

      //If the deal is missing fallback to trying to find the Save: $XX.XX (XX%) string value
      if(!savingsRawStr || !savingsRawStr.length){
        savingsRawStr = getStringWithXPath('//span[contains(text(),"Save:")]');
      }
      //If we found on, then there's a deal
      let isDeal = savingsRawStr.length ? true : false;
      let savingsPrice = null;
      let savingsPercent = null;

      //If there's a deal parse the deal string to break them into 2 parts: Price, and Percent
      if(isDeal){
        let savingsArray = savingsRawStr.split('(');

        if(savingsArray.length <= 1){
          savingsPrice = savingsRawStr;
        }
        else{
          savingsPrice = savingsArray[0];
          savingsPrice = savingsPrice.trim();

          if(savingsPrice.indexOf(':') != -1){
            let s = savingsPrice.split(':');
            savingsPrice = s[s.length-1];
            savingsPrice = savingsPrice.trim();
          }
          savingsPercent = savingsArray[1];
          savingsPercent = savingsPercent.trim();
          savingsPercent = savingsPercent.split('%')[0] + '%';
        }
      }

      //Send it off
      return {
        'original_price': original_price,
        'current_price': current_price,
        'savings_price': savingsPrice,
        'savings_percent': savingsPercent,
        'isDeal': isDeal
      }
    })
    .end()
    .then(function(value){
      if(value === false){
        reject('Invalid response while processing');
        return;
      }

      resolve(value);
    })
    .catch(function(error){
      reject(error);
    });
  }
}

module.exports = AmazonPriceChecker;