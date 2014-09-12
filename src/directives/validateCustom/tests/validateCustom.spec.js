describe('validateCustom', function() {

  var $compile;
  var $scope;
  var $provide;
  var $formElem;
  var $inputElem;

  beforeEach(module('pmkr.validateCustom'));

  beforeEach(module(['$provide', function(_$provide_) {

    $provide = _$provide_;

    $provide.factory('pmkr.debounce', function($q) {
      function debounce(fn) {
        return function() {
          return $q.when(fn());
        }
      }
      var service = debounce;
      service.latest = debounce;
      return service;
    });

  }]));

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
    expect($scope.form.foo.$error.unique).toBeFalsy();
  });

  it('should not call `opts.fn` when gated', function() {
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
    expect($scope.form.foo.$error.unique).toBeFalsy();
  });

  it('should wrap `opts.fn` in `debounce` and `debounce.latest`', function() {
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

  it('should be valid when `opts.fn` returns `true`', function() {
    $scope.opts.fn = function() { return true; };

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.form.foo.$setValidity('unique', false);
    $scope.$digest();
    expect($scope.form.foo.$error.unique).toBeFalsy();
  });

  it('should set $error[opts.name] `true` when `opts.fn` returns `false`', function() {
    $scope.opts.fn = function() { return false; };

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.form.foo.$setValidity('unique', false);
    $scope.$digest();
    expect($scope.form.foo.$error.unique).toBe(true);
  });

  it('should set `props.pending` `true` while debouncing/validating', function() {

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

  it('should set `props.validating` `true` while validating', function() {

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

  it('should set `props.pending`,`props.validating` to `false` when gated', function () {
    $scope.opts.gate = function() { return true; };
    $scope.opts.props = 'fooProps';

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    expect($scope.fooProps.pending).toBe(false);
    expect($scope.fooProps.validating).toBe(false);
    $scope.fooProps.pending = true;
    $scope.fooProps.validating = true;
    $scope.$digest();
    expect($scope.fooProps.pending).toBe(false);
    expect($scope.fooProps.validating).toBe(false);
  });

  it('should set `props.checkedValue` to the most recent checked value', function() {
    $scope.opts.fn = function() { return true; };
    $scope.opts.props = 'fooProps';

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    expect($scope.fooProps.checkedValue).toBe(null);
    $scope.form.foo.$setViewValue('abc');
    $scope.$digest();
    expect($scope.fooProps.checkedValue).toBe('abc');
  });

  it('should initially set `props.valid` and `props.invalid` to `null`', function() {
    $scope.opts.props = 'fooProps';

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    expect($scope.fooProps.valid).toBe(null);
    expect($scope.fooProps.invalid).toBe(null);
  });

  it('should set `props.valid` and `props.invalid` to `null` when gated', function() {
    $scope.opts.props = 'fooProps';
    $scope.opts.gate = function() { return true; };

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.$digest();
    expect($scope.fooProps.valid).toBe(null);
    expect($scope.fooProps.invalid).toBe(null);
  });

  it('should set `props.valid` and `props.invalid` to result after validating', function() {
    $scope.opts.fn = function() { return true; };
    $scope.opts.props = 'fooProps';

    $inputElem.attr('pmkr-validate-custom', 'opts');
    $compile($formElem)($scope);
    $scope.$digest();
    expect($scope.fooProps.valid).toBe(true);
    expect($scope.fooProps.invalid).toBe(false);
  });

});