let getMatches = function(str, regex) {
  var out = null;
  if (regex.test(str))
    out = regex.exec(str);
  
  return(out);
};

module.exports = {
  extractASINFromURL: function(str){
    let regexs = new Array(
      /ASIN\.1=([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
      /ASIN=([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
      /dp\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
      /dp\/product\-description\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
      /product\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
      /.*?offer\-listing\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
      /product\-reviews\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
      /dp\/premier\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
      /d\/.*?\/.*?\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i
      );

    if (str.match(/\/gp\/slredirect\/redirect\.html/)) {
      return null;
    }

    for (i = 0; i < regexs.length; i++) {
      regex = regexs[i];
      var asin = getMatches(str, regex);
      if (asin){
        return(asin[1]);
      }
    }
    return null;
  }
};