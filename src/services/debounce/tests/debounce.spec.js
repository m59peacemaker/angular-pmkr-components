describe('debounce', function() {

  var $timeout;
  var debounce;

  beforeEach(module('pmkr.debounce'));

  beforeEach(inject(function(_$timeout_) {
    $timeout = _$timeout_;
  }));

  beforeEach(inject(['pmkr.debounce', function(_debounce_) {
    debounce = _debounce_;
  }]));

  describe('(main)', function() {

    it("stuff", function() {
      var called = 0;
      function fn() {
        ++called;
      }
      var debouncedFn = debounce(fn, 100);
      debouncedFn();
      debouncedFn();
      expect(called).toBe(0);
      $timeout.flush(100);
      expect(called).toBe(1);
    });

  });

});