
const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'proj-name',
  src: true,
});
