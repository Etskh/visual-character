'use strict'

var assert = require('assert')
var expect = require('expect')

var auth = require('../server/user')

describe('User', function() {
  describe('Can retreive the test user', function() {
    it('should not fail when asking for user "user"', function(done) {
      auth.getByName('user').then(function(user) {
        done();
      });
    });
    it('should fail when asking for user "notuser"', function(done) {
      auth.getByName('notuser').then(function(user) {
        // empty
      }, function(){
        done();
      });
    });
  });
});
