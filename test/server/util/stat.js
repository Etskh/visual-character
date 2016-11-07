
const assert = require('assert')
const expect = require('expect')


describe('Util / Stat', function() {

  const stat = require('../../../server/lib/util/stat')
  const effect = require('../../../server/lib/util/effect')

  const effectData = [{
    name: 'name',
    type: 'type',
    dismissible: false,
    stats: {
      'ac': 2,
    },
  }, {
    name: 'name2',
    type: 'type2',
    dismissible: false,
    stats: {
      'ac': 1,
    },
  }]
  const effects = Promise.all([
    effect.createFromData(effectData[0]),
    effect.createFromData(effectData[1]),
  ])

  it('creates an stat controller from data', function(done) {
    const acStat = stat.createFromData({
      name: 'ac',
      base_value: 10,
    }, effects)

    acStat.sum()

    done()
  })
})
