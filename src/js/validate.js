export default class Validator {
 
  static geoValidate(str) {
    return /\d+\.\d+\, \d+.\d+/.test(str);
  }
  
}