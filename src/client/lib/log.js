

export default class Log {
  // empty
}

Log.log = function log(...args) {
  // log.caller <- caller of log();
  // eslint-disable-next-line no-console
  console.log.apply(this, args);
};
Log.warn = function warn(...args) {
  // eslint-disable-next-line no-console
  console.warn.apply(this, args);
};
Log.error = function error(...args) {
  // eslint-disable-next-line no-console
  console.error.apply(this, args);
};
