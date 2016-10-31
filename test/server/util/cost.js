
const assert = require('assert')
const expect = require('expect')


describe('Util / Cost', function() {

  const cost = require('../../../server/lib/util/cost')

  it('Correctly creates a standardized cost string', function(done) {

    expect(cost.toSmallestDenomination(100)).toEqual('1gp')
    expect(cost.toSmallestDenomination(666)).toEqual('6gp 6sp 6cp')
    expect(cost.toSmallestDenomination(3500)).toEqual('35gp')

    done()
  })
})
