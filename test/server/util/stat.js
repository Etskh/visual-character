
var assert = require('assert')
var expect = require('expect')


describe('Util / Stat', function() {

  var stat = require('../../../server/util/stat')

  const statusEffects = []

  it('creates an stat controller from data', function(done) {
    const acStat = stat.createFromData({
      name: 'ac',
      base_value: 10,
    }, statusEffects)

    done()
  })
})
