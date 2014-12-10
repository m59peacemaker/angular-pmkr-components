describe('memoize', function() {

  var memoize;

  beforeEach(module('pmkr.memoize'));

  beforeEach(inject(['memoize', function(_memoize_) {
    memoize = _memoize_;
  }]));

  it('should return a function that returns the same value when called again with the same arguments', function() {
    var x = 0;
    var memoizedFn = memoize(function() {
      return ++x;
    });
    var result = memoizedFn();
    expect(memoizedFn()).toBe(result);
    expect(memoizedFn()).toBe(result);
    result = memoizedFn(1);
    expect(memoizedFn(1)).toBe(result);
  });

  it('should return a function that returns a new value when called again with different arguments', function() {
    var memoizedFn = memoize(function(arg) {
      return arg+1;
    });
    var result = memoizedFn(1);
    expect(memoizedFn(2)).not.toBe(result);
  });

});
