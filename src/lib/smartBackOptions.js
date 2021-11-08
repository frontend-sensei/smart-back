export class SmartBackOptions {
  constructor(options) {
    this.options = options;
  }

  validate(propertyName, reserveValue) {
    if (this.options.hasOwnProperty(propertyName)) {
      return this.options[propertyName];
    }
    return reserveValue;
  }
}
