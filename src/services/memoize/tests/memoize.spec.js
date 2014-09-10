describe('memoize', function() {

  var memoize;
  var memoizedFn;

  beforeEach(module('pmkr.memoize'));

  beforeEach(inject(['pmkr.memoize', function(_memoize_) {
    memoize = _memoize_;

    memoizedFn = memoize(function() {
      return Math.random();
    });
  }]));

  it('should return a function that returns the same value when called again with the same arguments', function() {
    var result = memoizedFn();
    expect(memoizedFn()).toBe(result);
    expect(memoizedFn()).toBe(result);
    result = memoizedFn(1);
    expect(memoizedFn(1)).toBe(result);
  });

  it('should return a function that returns a new value when called again with different arguments', function() {
    var result = memoizedFn();
    expect(memoizedFn(1)).not.toBe(result);
  });

});