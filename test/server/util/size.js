
const assert = require('assert')
const expect = require('expect')


describe('Util / Size', function() {

  const size = require('../../../server/lib/util/size')

  it('Gets a size from the standard list', function(done) {
    size.getByName('small')
    .then(function(s) {
      done()
    })
  })

  it('Rejects if it\'s not the name of a size', function(done) {
    size.getByName('This is not the name of a size')
    .then(function(s) {
      // empty
    }, function(e) {
      done()
    })
  })
})
