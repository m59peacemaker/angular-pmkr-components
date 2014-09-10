describe('pristineOriginal', function() {

  var $compile;
  var $scope;
  var $formElem;
  var $inputElem;

  beforeEach(module('pmkr.pristineOriginal'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $scope = _$rootScope_;

    $scope.opts = {};
    $formElem = angular.element('<form name="form"></form>');
    $inputElem = angular.element('<input name="foo" ng-model="foo" pmkr-pristine-original="opts">');
    $formElem.append($inputElem);
  }));

  it('should return ngModel to pristine when original value is empty and value becomes empty again', function() {
    $compile($formElem)($scope);
    $scope.$digest();

    $scope.form.foo.$setViewValue('abc');
    $scope.$digest();
    expect($scope.form.foo.$dirty).toBe(true);

    $scope.form.foo.$setViewValue('');
    $scope.$digest();
    expect($scope.form.foo.$pristine).toBe(true);
  });

  it('should return ngModel to pristine when original value is "abc" and value becomes "abc" again', function() {
    $scope.foo = 'abc';
    $compile($formElem)($scope);
    $scope.$digest();

    $scope.form.foo.$setViewValue('123');
    $scope.$digest();
    expect($scope.form.foo.$dirty).toBe(true);

    $scope.form.foo.$setViewValue('abc');
    $scope.$digest();
    expect($scope.form.foo.$pristine).toBe(true);
  });

  it('should return ngModel to pristine when original value is "abc" and value becomes "Abc" if `opts.caseSensitive:false`', function() {
    $scope.foo = 'abc';
    $scope.opts.caseSensitive = false;
    $compile($formElem)($scope);
    $scope.$digest();

    $scope.form.foo.$setViewValue('Abc');
    $scope.$digest();
    expect($scope.form.foo.$pristine).toBe(true);
  });

});