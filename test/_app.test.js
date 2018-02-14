var assert = require('assert');
var testee = require('../app');
var testee_name = 'app';

describe(testee_name, function() {
  describe('exporter', function() {
    describe('init', function() {
      var init = testee;
      it('should be implemented', function() {
        assert(init != undefined);
      });
      it('should be called', function() {
        assert(init({}) !== undefined);
      });
    });
  });
});
