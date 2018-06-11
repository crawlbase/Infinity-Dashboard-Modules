class CurrencyConvertor{
  constructor(rates){
    this.rates = rates;
    this.error = null;
  }

  convertFromToWithValue(fromUnit, toUnit, value){
    if(fromUnit == toUnit || value === 0){
      return value;
    }
    
    if(!this.rates[fromUnit]){
      let error = 'Missing input unit from the list: ' + fromUnit;
      console.error(error);
      this.error = error;
      return -1;
    }

    if(!this.rates[toUnit]){
      let error = 'Missing output unit from the list: ' + toUnit;
      console.error(error);
      this.error = error;
      return -1;
    }

    let fromRate = this.rates[fromUnit];
    let toRate = this.rates[toUnit];
    
    let valueInFromUnit = (value / fromRate);
    return (valueInFromUnit * toRate);
  }
}

module.exports = CurrencyConvertor;