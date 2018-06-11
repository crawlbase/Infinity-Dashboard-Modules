class ITCParser{
  constructor(tsvString){
    this.tsvString = tsvString;
  }

  parse(){
    let data = this.tsvString;

    let lines = data.split("\n");
    let returnArray = [];

    let headerObj = null;

    lines.forEach(function(line, index){
      let components = line.split("\t");

      //If this is the first line then just record
      //The header object
      if(index == 0){
        headerObj = components;
        return;
      }

      //Ignore items that aren't the same length
      //as the header item
      if(components.length != headerObj.length){
        return;
      }

      let lineObj = {};

      headerObj.forEach(function(key, index){
        let value = components[index];
        value = value.trim();

        lineObj[key] = value;
      });

      returnArray.push(lineObj);
    });

    return returnArray;
  }
}

module.exports = ITCParser;