

export default class Log {
  static log(...args) {
    // eslint-disable-next-line no-console
    console.log.apply(this, args);
  }
  static warn(...args) {
    // eslint-disable-next-line no-console
    console.warn.apply(this, args);
  }
  static error(...args) {
    // eslint-disable-next-line no-console
    console.error.apply(this, args);
  }
}
