const moment = require('moment');
const fiplab = require('fiplab');

class Cache{
  constructor(){
    let defaults = { 
      cache: []
    };

    this.db = fiplab.db;
    this.db.defaults(defaults).write();
  }

  yesterdaysCachedData(username){
    let dateString = moment().subtract(1, 'days').format('YYYYMMDD');
    dateString += username;

    let item = this.db.get('cache').find({id: dateString});
    let obj = item.value();
    if(!obj){
      return null;
    }

    return obj.data;
  }

  addCachedData(data, username){
    let dateString = moment().subtract(1, 'days').format('YYYYMMDD');
    dateString += username;
    
    let obj = {
      'id': dateString,
      'data': data
    };

    //Remove all the previous days data
    this.db.get('cache').remove().write();

    //Save the new data
    this.db.get('cache').push(obj).write();
  }
}

module.exports = Cache;