'use strict'

var assert = require('assert')
var expect = require('expect')


describe('User', function() {

  var auth = require('../../server/lib/user')

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
