const request = require('request');

class ClickyStats{
  constructor(options){
    this.username = options.username;
    this.password = options.password;
    this.siteID = options.siteID;
  }

  getStats(){
    let promise = new Promise(this._getSiteInfo.bind(this));
    return promise;
  }

  _getSiteInfo(finalResolve, finalReject){
    this._actuallyGetSiteInfo()
    .then(this._handleSiteInfoResponse.bind(this, finalResolve, finalReject))
    .catch(function(err){
      finalReject(err);
    });
  }

 _actuallyGetSiteInfo(){
    let sendRequest = function(resolve, reject){
      let username = this.username;
      let password = this.password;

      let callback = function(err, resp, body){
        try{
          body = JSON.parse(body);
          resolve(body);
        } catch(e){
          reject(e);
        }
      };
      request({
        url: 'http://api.clicky.com/api/account/sites?username=' + username + '&password=' + password + '&output=json'
      }, callback);
    }; //End sendRequest    

    //Return promise
    let promise = new Promise(sendRequest.bind(this));
    return promise;
  }

  _actuallyGetStatsWithKey(siteKey){
    let siteID = this.siteID;

    let sendRequest = function(resolve, reject){
      let callback = function(err, resp, body){
        try{
          body = JSON.parse(body);
          resolve(body);
        } catch(e){
          reject(e);
        }
      };
      request({
        url: 'https://api.clicky.com/api/stats/4?site_id=' + siteID + '&sitekey=' + siteKey + '&type=visitors-unique,bounce-rate&output=json'
      }, callback);
    }; //End sendRequest    

    //Return promise
    let promise = new Promise(sendRequest.bind(this));
    return promise;
  }

  //helpers
  _handleSiteInfoResponse(finalResolve, finalReject, siteInfoArray){
    let siteInfo = this._getSiteWithInfoArray(siteInfoArray);
    
    if(!siteInfo){
      finalReject('Could not find site with ID: ' + this.siteID);
      return;
    }

    console.log(siteInfo);
    
    let siteKey = siteInfo.sitekey;

    this._actuallyGetStatsWithKey(siteKey)
    .then(this._handleStatsResponse.bind(this, finalResolve, finalReject))
    .catch(function(err){
      finalReject(err);
    });
  }

  _handleStatsResponse(finalResolve, finalReject, statsArray){
    try{
      console.log(statsArray);

      let stats = {
        'unique': '0',
        'bounce': '0',
      };

      statsArray.forEach(function(obj){
        let type = obj.type;
        let valObj = obj.dates[0].items[0].value;

        if(type == 'visitors-unique'){
          stats.unique = valObj;
        }
        else if(type == 'bounce-rate'){
          stats.bounce = valObj; 
        }
      });
      console.log(stats);
      finalResolve(stats);
    }
    catch(err){
      finalReject(err);
    }
  }
 
  _getSiteWithInfoArray(infoArray){
    let result = null;
    let siteID = this.siteID;

    infoArray.some(function(elem){
      if(elem.site_id == siteID){
        result = elem;
        return true;
      }

      return false;
    });

    return result;
  }
}


module.exports = ClickyStats;