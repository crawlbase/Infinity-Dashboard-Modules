const fiplab = require('fiplab');
const OAuth = require('./OAuth');
const FitBitAPI = require('./FitBitAPI');

class Module{
  constructor(){
    this.db = fiplab.db;
    this._setupDefaults();

    this.oauth = new OAuth(fiplab.arguments.clientID, fiplab.arguments.secret, fiplab.arguments.port);
  }

  run(){
    let token = this._getToken();
    if(!token){
      this._requestToken();
    }
    else if(this.oauth.isAccessTokenExpired(token)){
      this._refreshToken(token);
    }
    else{
      this._requestFitbitData(token);
    }
  }

  _refreshToken(token){
    console.log('Refresh', token);
    this.oauth.refreshToken(token)
    .then(this._handleTokenRefresh.bind(this))
    .catch(function(err){
      fiplab.exit(err.toString(), false);
    });
  }

  _handleTokenRefresh(tokenObj){
    console.log('Refresh token: ', tokenObj);
    this._saveToken(tokenObj);
    this._requestFitbitData(tokenObj.token);
  }

  _requestToken(){
    let that = this;

    this.oauth.requestToken()
    .then(function(token){
      console.log('Got token:', token);

      that._saveToken(token);
      that._requestFitbitData(token.token);
    })
    .catch(function(err){
      fiplab.exit(err.toString(), false);
    });
  }

  _requestFitbitData(token){
    let display = fiplab.arguments.display;

    let weightKeys = ['weight','bodyFat','weightAndBodyFat'];

    this.fitbitAPI = new FitBitAPI(token);
    if(weightKeys.indexOf(display) !== -1){
      this.fitbitAPI.getWeightData(fiplab.arguments.units)
       .then(this._handleWeightResponse.bind(this))
       .catch(function(err){
        fiplab.exit(err.toString(), false);
      });
    }
    else{
      this.fitbitAPI.getActivityData()
       .then(this._handleActivityResponse.bind(this))
       .catch(function(err){
        fiplab.exit(err.toString(), false);
      });
    }
  }

  _handleWeightResponse(data){
    let weightArr = data.weight;
    if(!data || !weightArr.length){
      fiplab.exit('No weight data', true);
      return;
    }

    let display = fiplab.arguments.display;
    let units = fiplab.arguments.units;
    
    let suffix = 'kg';

    if(units == 'imperial'){
      suffix = 'lbs';
    }

    let last = weightArr[weightArr.length-1];
    let weight = last.weight;
    let bf = last.fat;

    let weightString = weight.toFixed(1) + suffix;
    let fatString = bf.toFixed(2) + '%';
    let returnString = weightString;

    if(display == 'bodyFat'){
      returnString = fatString;
    }
    else if(display == 'weightAndBodyFat'){
      returnString = weightString + ' (' + fatString + ')';
    }

    fiplab.exit(returnString, true);
  }

  _handleActivityResponse(data){
    try{
      let summary = data.summary;
      let steps = summary.steps;

      fiplab.exit(steps.toFixed(0), true);
    } 
    catch(err){
      fiplab.exit('Invalid Server Response', false);
    }
  }

  _setupDefaults(){
    let defaults = { 
      token: []
    };

    this.db.defaults(defaults).write();
  }

  _saveToken(token){
    let existingToken = this._getToken(true);

    if(existingToken){
      let item = this.db.get('token[0]');
      item.assign(token).write();
      return;
    }

    this.db.get('token').push(token).write();
  }

  _getToken(rawValue){
    let item = this.db.get('token[0]');
    if(!item.size().value()){
      return null;
    }

    if(rawValue === true){
      return item.value();
    }
    return item.value().token;
  }
}

let app = new Module();
app.run();