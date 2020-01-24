var assert = require('assert');
var bcUtil = require('./bcUtil');

describe('generateRandomUsername Test', function() {
    
    var should_return_value_startswith_prefix = 'should return value starting with prefix';
    it(should_return_value_startswith_prefix, function() {
        var prefix = bcUtil.generateRandomUsername();
        var result = bcUtil.generateRandomUsername(prefix);
        assert.equal(result.indexOf(prefix), 0, should_return_value_startswith_prefix + ", but FAILED");
    });
    
    var should_return_different_values = 'should return different values for multiple calls';
    it(should_return_different_values, function() {
        var prefix = bcUtil.generateRandomUsername();
        var result0 = bcUtil.generateRandomUsername(prefix);
        var result1 = bcUtil.generateRandomUsername(prefix);
        assert.notEqual(result0, result1, should_return_different_values + ", but FAILED");
    });
});