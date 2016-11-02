'use strict'

var assert = require('assert')
var expect = require('expect')


describe('User', function() {

  var auth = require('../../../server/lib/user')

  describe('Can retreive the test user', function() {
    it('can get a user by name "user"', function(done) {
      auth.getByName('user').then(function(user) {
        expect(user.getCharacters()).toExist();
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

  describe('Can authenticate', function() {
    it('should authenticate a real user', function(done){
      auth.authenticate('user', 'pass')
        .then(function(user){
          done();
        });
    });
    it('should throw an exeption when wrong password is given', function(done){
      auth.authenticate('user', 'not-the-password')
        .then(function(){},
        function(error) {
          expect(error).toEqual('Incorrect password');
          done();
        });
    });
  });

  describe('Can check permissions to characters', function() {
    it('should be able to have permission to its own', function(done) {
      auth.getByName('user').then(function(user) {
        return user.getCharacters().then(function(characters){
          return user.hasPermissionToCharacter(characters[0].id)
          .then(function(character){
            done();
          });
        });
      }, function(error) {
        expect(error).toNotExist();
        done();
      });
    });
  });

  describe('Can get an set an active character', function() {
    it('should save and retrive active characters', function(done) {
      auth.getByName('user').then(function(user) {
        return user.getCharacters().then(function(characters) {
          user.saveActiveCharacter(characters[0].id);
          user.getActiveCharacter().then(function(character) {
            expect(characters[0].id).toEqual(character.id);
            done();
          });
        });
      });
    });
  });

});
