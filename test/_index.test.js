var assert = require('assert');
var testee = require('../index');
var testee_name = 'index';

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
