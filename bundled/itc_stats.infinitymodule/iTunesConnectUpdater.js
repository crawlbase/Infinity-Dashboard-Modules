const AppleReporter = require('apple-reporter');
const ITCParser = require('./ITCParser');
const moment = require('moment');
const Cache = require('./Cache');

class iTunesConnectUpdater{
  constructor(userid, password){
    this.userid = userid;

    this.reporter = new AppleReporter({
      userid: userid,
      password: password, 

      tokenOptions: {
        forceRetrieve: true,
        generateNewIfNeeded: true
      }
    });

    this.cacheDB = new Cache();
  }

  update(){
    let promise = new Promise(this._startUpdate.bind(this));
    return promise;
  } 

  _startUpdate(resolve, reject){
    //Check to see if we have any data in the cache first
    let cachedData = this.cacheDB.yesterdaysCachedData(this.userid);

    if(cachedData){
      console.info('Using cached data');
      this._handleReportData(resolve, reject, cachedData, true);
      return;
    }

    let reporter = this.reporter;

    let that = this;

    //Get or generate an access token
    reporter.retrieveAccessToken()
    .then(function(){
      console.log('Verifying iTunes Connect is available.');
      //Verify iTC is Up
      reporter.Sales.getStatus()
      .then(function(){
        console.log('Getting the list of vendors to get the ID from.');

        //Get the list of vendors
        reporter.Sales.getVendors()
        .then(that._handleVendorsUpdate.bind(that, resolve, reject))
        .catch(reject);
      })
      .catch(reject);
    })
    .catch(reject);
  }

  _handleVendorsUpdate(resolve, reject, data){
    console.log('Requesting Yesterdays Sales Report');
    let vendorID = data.Vendors.Vendor[0];
    let date = moment().subtract(1, 'days').format('YYYYMMDD');

    let options = {
      vendorNumber: vendorID,
      regionCode: 'US',
      reportType: 'Sales',
      reportSubType: 'Summary',
      dateType: 'Daily',
      date: date
    };

    this.reporter.Sales.getReport(options).
    then(this._handleReportData.bind(this, resolve, reject))
    .catch(reject);
  }

  _handleReportData(resolve, reject, tsvData, dontCache){
    if(!tsvData){
      resolve('Pending Release');
      return;
    }

    let itcParser = new ITCParser(tsvData);
    let data = itcParser.parse();

    if(!data){
      reject('Invalid report data');
      return;
    }

    if(!dontCache){
      this.cacheDB.addCachedData(tsvData, this.userid);
    }

    resolve(data);
  }
}

module.exports = iTunesConnectUpdater;