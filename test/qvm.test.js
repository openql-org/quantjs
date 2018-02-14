var assert = require('assert');
var testee = require('../build/qvm');
var testee_name = 'qvm';

describe(testee_name, function() {
  describe('COMMANDS', function() {
    describe('init', function() {
      it('should implement the function', function() {
        assert(testee.COMMANDS.init != undefined);
        var r = testee.COMMANDS.init();
      });
    });
  });
});
