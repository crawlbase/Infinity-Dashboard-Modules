const fiplab = require('fiplab');
const os = require('os');
const exec = require('child_process').exec;
const version_compare = require('./version_compare');

function humanFileSize(bytes) {
  let thresh = 1024;
  if(Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  
  var units = ['KB','MB','GB','TB','PB','EB','ZB','YB']
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while(Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(2)+' '+units[u];
}

class MemoryInfo{

  getMemoryInfo(){
    let promise = new Promise(this._actuallyGetInfo.bind(this));
    return promise;
  }

  _actuallyGetInfo(resolve, reject){
    let that = this;
    this.getOSVersion()
    .then(function(osVersion){
      try{
       that._seriouslyActuallyGetInfo(osVersion, resolve, reject)
     } 
    catch(e){
      reject(e);
    }
    }).catch(reject);
  }

  _seriouslyActuallyGetInfo(osVersion, resolve, reject){
    exec('vm_stat', function(err, stdout){
      let lines = stdout.toString().split('\n');

      let header = lines[0];
      let pageSize = parseInt(header.match(/[0-9]+/)[0]);

      let dict = {};
      lines.shift();
      lines.forEach(function(line){
        line = line.trim();
        if(!line.length){
          return;
        }

        let arr = line.split(':');

        let key = arr[0].trim();
        let value = parseInt(arr[1], 10);

        dict[key] = value;
      });

      let total = os.totalmem();

      let internal_count = dict['Anonymous pages'];
      let compressor_count = dict['Pages occupied by compressor'];
      let wired_count = dict['Pages wired down'];
      let purgeable_count = dict['Pages purgeable'];
      let external_count = dict['File-backed pages'];
      let active_count = dict['Pages active'];
      let inactive_count = dict['Pages inactive'];

      let usedMemory = 0;

      if(version_compare(osVersion, '10.9.0') >= 0){
        if(version_compare(osVersion, '10.10.3') >= 0){
          usedMemory = internal_count + compressor_count + wired_count + purgeable_count;
        }
        else{
          usedMemory = internal_count + external_count + compressor_count + wired_count;
        }
      }
      else{
        usedMemory = active_count + inactive_count + wired_count;
      }

      usedMemory *= pageSize;

      let returnObj = {
        'used': humanFileSize(usedMemory),
        'free': humanFileSize(total - usedMemory),
        'total': humanFileSize(total)
      };

      resolve(returnObj);
    });
  }

  getOSVersion(){
    let promise = new Promise(function(resolve, reject){
      exec('/usr/bin/plutil -p /System/Library/CoreServices/SystemVersion.plist | grep ProductVersion', function(err, stdout){
        if(err){
          reject(err);
          return;
        }

        try{
          let version = stdout.match(/([0-9]+)(\.[0-9]+)(\.[0-9]+)?/);
          if(!version){
            reject('Could not get OS version');
          }
          else{
            resolve(version[0]);
          }
        } catch(e){
          reject(e);
        }
      });
    });

    return promise;
  }
}

//
let info = new MemoryInfo();

info.getMemoryInfo()
.then(function(obj){
  console.log(obj);
  let config = fiplab.arguments;
  let display = config.display;

  fiplab.exit(obj[display], true);
})
.catch(function(err){
  fiplab.exit(err.toString(), false);
});