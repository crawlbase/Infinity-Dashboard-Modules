const fiplab = require('fiplab');
const si = require('systeminformation');

//https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
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

//Get Size
si.fsSize()
.then(function(dataArray){
  let data = null;
  dataArray.forEach(function(obj){
    if(obj.mount === '/'){
      data = obj;
    }
  });

  if(!data){
    fiplab.exit('Could not find disk', false);
    return;
  }

  let usedPercent = (100 - data.use);

  if(fiplab.arguments.usePercent){
    fiplab.exit(usedPercent.toFixed(0) + '%', true);
    return;
  }

  let space = humanFileSize(data.size - data.used);
  fiplab.exit(space, true);
})
.catch(function(err){
  console.log(err.toString());
  fiplab.exit('er', false);
});