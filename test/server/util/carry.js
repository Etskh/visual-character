'use strict'

const assert = require('assert')
const expect = require('expect')


describe('Carry', function() {

  const carryUtil = require('../../../server/lib/util/carry')
  const sizeUtil = require('../../../server/lib/util/size')

  it('get load name based on weight carried', function(done) {

    const data = {
      stats: {
        str: 18,
      }
    }

    sizeUtil.getByName('medium').then( function(size) {
        expect(carryUtil.getLoadName( 0, data, size )).toBe('light')
        expect(carryUtil.getLoadName( 150, data, size )).toBe('medium')
        expect(carryUtil.getLoadName( 250, data, size )).toBe('heavy')
        expect(carryUtil.getLoadName( 999, data, size )).toBe('staggering')
        done()
    })
  })
})
