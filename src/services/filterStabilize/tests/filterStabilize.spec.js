describe('filterStabilize', function() {

  var $filterProvider;
  var $compile;
  var $scope;

  beforeEach(module('pmkr.filterStabilize'));

  beforeEach(module(function(_$filterProvider_) {
    $filterProvider = _$filterProvider_;
  }));

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $compile = _$compile_;
    $scope = _$rootScope_;
  }));

  it('is needed to prevent infinite digest when filter is unstable', function() {
    $filterProvider.register('testFilter', function() {
      var i = 0;
      return function() { return ++i; };
    });
    var elem = angular.element("<p>{{'abc'|testFilter}}</p>");
    $compile(elem)($scope);
    expect($scope.$digest.bind($scope)).toThrow();
  });

  it('stabilizes unstable filter', function() {
    $filterProvider.register('testFilter', ['pmkr.filterStabilize', function(stabilize) {
      var i = 0;
      return stabilize(function() { return ++i; });
    }]);
    var elem = angular.element("<p>{{'abc'|testFilter}}</p>");
    $compile(elem)($scope);
    expect($scope.$digest.bind($scope)).not.toThrow();
  });

  it('prevents filter from modifying original input reference', function() {
    $filterProvider.register('testFilter', ['pmkr.filterStabilize', function(stabilize) {
      return stabilize(function(arr) {
        arr[0] = 'abc';
        return arr;
      });
    }]);
    $scope.foo = [1,2,3];
    var elem = angular.element("<p>{{foo|testFilter}}</p>");
    $compile(elem)($scope);
    $scope.$digest();
    expect($scope.foo).toEqual([1,2,3]);
  });

  it('makes `return` of input reference optional', function() {
    $filterProvider.register('testFilter', ['pmkr.filterStabilize', function(stabilize) {
      return stabilize(function(arr) { arr[0] = 'abc' });
    }]);
    $scope.foo = [1,2,3];
    var elem = angular.element("<p>{{foo|testFilter}}</p>");
    $compile(elem)($scope);
    $scope.$digest();
    expect($scope.$eval(elem.text())).toEqual(['abc',2,3]);
  });

});