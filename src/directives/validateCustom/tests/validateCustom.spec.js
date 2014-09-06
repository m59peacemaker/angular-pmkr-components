angular.module('pmkr.debounce', [])
.factory('pmkr.debounce', function($q) {
  function debounce(fn) {
    return function() {
      return $q.when(fn());
    }
  }
  var service = debounce;
  service.latest = debounce;
  return service;
})
;

describe('validateCustom', function() {
  var $compile;
  var $scope;
  var $provide;
  var $formElem;
  var $inputElem;

  beforeEach(module('pmkr.validateCustom'));

  beforeEach(module(['$provide', function(_$provide_) {
    $provide = _$provide_;
  }]))

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $scope = _$rootScope_;

    $formElem = angular.element('<form name="form"></form>');
    $inputElem = angular.element('<input name="foo" ng-model="foo">');
    $formElem.append($inputElem);
    $scope.opts = {name:'unique'};
  }));

  it('should accept argument object as view string', function() {
    $scope.fooValid = function() {};
    spyOn($scope, 'fooValid');
    $inputElem.attr('pmkr-validate-custom', "{name:'unique', fn:fooValid}");
    $compile($formElem)($scope);
    $scope.$digest();
    expect($scope.fooValid).toHaveBeenCalled();
  });

  it('should accept argument object from controller', function() {
    $scope.opts.fn = function() {};

    spyOn($scope.opts, 'fn');
    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.$digest();
    expect($scope.opts.fn).toHaveBeenCalled();
  });

  it('should initially be valid', function() {
    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    expect($scope.form.foo.$error.unique).toBe(false);
  });

  it('should not call opts.fn when gated', function() {
    $scope.opts.fn = function(){};
    $scope.opts.gate = function() { return true; };

    spyOn($scope.opts, 'fn');
    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.$digest();
    expect($scope.opts.fn).not.toHaveBeenCalled();
  });

  it('should be valid when gated', function() {
    $scope.opts.gate = function() { return true; };

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.form.foo.$setValidity('unique', false);
    $scope.$digest();
    expect($scope.form.foo.$error.unique).toBe(false);
  });

  it('should wrap opts.fn in debounce and debounce.latest', function() {
    var debounced = false;
    var debouncedLatest = false;

    $provide.decorator('pmkr.debounce', function($q) {
      var debounce = function() {
        debounced = true;
      };
      debounce.latest = function() {
        debouncedLatest = true;
      };
      return debounce;
    });

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);

    expect(debounced).toBe(true);
    expect(debouncedLatest).toBe(true);
  });

  it('should be valid when opts.fn returns true', function() {
    $scope.opts.fn = function() { return true; };

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.form.foo.$setValidity('unique', false);
    $scope.$digest();
    expect($scope.form.foo.$error.unique).toBe(false);
  });

  it('should be invalid when opts.fn returns false', function() {
    $scope.opts.fn = function() { return false; };

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.form.foo.$setValidity('unique', false);
    $scope.$digest();
    expect($scope.form.foo.$error.unique).toBe(true);
  });

  it('should set props.pending = true while debouncing/validating', function() {

    $provide.decorator('pmkr.debounce', function($q) {
      function debounce(fn) {
        return function() {
          expect($scope.fooProps.pending).toBe(true);
          return $q.when(fn());
        };
      }
      var service = debounce;
      service.latest = debounce
      return service;
    });

    $scope.opts.props = 'fooProps';
    $scope.opts.fn = function() {
      expect($scope.fooProps.pending).toBe(true);
    };

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    expect($scope.fooProps.pending).toBe(false);
    $scope.$digest();
    expect($scope.fooProps.pending).toBe(false);
  });

  it('should set props.validating = true while validating', function() {

    $provide.decorator('pmkr.debounce', function($q) {
      function debounce(fn) {
        return function() {
          expect($scope.fooProps.validating).toBe(false);
          return $q.when(fn());
        };
      }
      var service = debounce;
      service.latest = debounce
      return service;
    });

    $scope.opts.props = 'fooProps';
    $scope.opts.fn = function() {
      expect($scope.fooProps.validating).toBe(true);
    };

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    expect($scope.fooProps.validating).toBe(false);
    $scope.$digest();
    expect($scope.fooProps.validating).toBe(false);
  });

  it('should set props.checkedValue to the most recent checked value', function() {
    $scope.opts.fn = function() { return true; };
    $scope.opts.props = 'fooProps';

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    expect($scope.fooProps.checkedValue).toBe(null);
    $scope.form.foo.$setViewValue('abc');
    $scope.$digest();
    expect($scope.fooProps.checkedValue).toBe('abc');
  });

});