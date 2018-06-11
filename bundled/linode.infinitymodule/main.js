const fiplab = require('fiplab');
const LinodeAPI = require('./LinodeAPI');

class LinodeBandwidth{
  run(){
    this._requestBandwidth(fiplab.arguments.accessToken);
  }

  _requestBandwidth(token){
    this.linodeAPI = new LinodeAPI(token);
    this.linodeAPI.getBandwidth()
    .then(this._handleBandwidthResponse.bind(this))
    .catch(function(err){
      fiplab.exit(err.toString(), false);
    });
  }

  _handleBandwidthResponse(bandwidth){
    //{"used": 1071, "billable": 0, "quota": 8000}
    let display = fiplab.arguments.display;

    let returnString = '';

    if(display == 'bandwidth'){
      returnString = bandwidth.used + 'GB';
    }
    else if(display == 'bandwidthAndTotal'){
      returnString = bandwidth.used + 'GB (' + bandwidth.quota + 'GB)'; 
    }
    else if(display == 'bandwidthPercent'){
      let percent = (bandwidth.used / bandwidth.quota) * 100;
      returnString = percent.toFixed(0) + '%';
    }

    fiplab.exit(returnString, true);
  }
}

//Run it
let app = new LinodeBandwidth();
app.run();
