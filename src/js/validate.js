export default class Validator {
  static geoValidate(str) {
    // eslint-disable-next-line
    const check = /\d+\.\d+\, \d+.\d+/;
    return check.test(str);
  }
}
