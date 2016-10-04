
var assert = require('assert')
var expect = require('expect')


describe('Stat', function() {

  var stat = require('../../../server/util/effect')

  const statusEffects = []

  it('creates an effect controller from data', function(done) {
    const acStat = stat.createFromData({
      name: 'ac',
      base_value: 10,
    }, statusEffects)

    done()
  })
})
