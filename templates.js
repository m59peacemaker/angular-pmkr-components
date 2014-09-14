angular.module("pmkr.componentsDemo").run(["$templateCache", function($templateCache) {$templateCache.put("tmpl/pristineOriginal.html","<p>Original Value: {{originalValue}} (not case sensitive)</p><form name=\"form\"><input name=\"foo\" ng-model=\"foo\" pmkr-pristine-original=\"opts\" class=\"form-control\"/></form><p ng-show=\"form.foo.$pristine\" class=\"alert alert-success\">The field is pristine.</p><p ng-show=\"form.foo.$dirty\" class=\"alert alert-success\">The field is dirty.</p>");
$templateCache.put("tmpl/userNameUnique.html","<form name=\"the_form\" class=\"form-group has-feedback\"><div ng-class=\"{\'has-success\':userNameUnique.valid, \'has-warning\':userNameUnique.invalid}\"><label for=\"user_name\">Username</label><input name=\"user_name\" ng-model=\"user.userName\" pmkr-validate-custom=\"{name:\'unique\', fn:checkUserNameUnique, gate:gateUserNameUnique, wait:500, props:\'userNameUnique\'}\" pmkr-pristine-original=\"\" class=\"form-control\"/><span ng-show=\"userNameUnique.valid\" class=\"glyphicon glyphicon-ok form-control-feedback\"></span><span ng-show=\"userNameUnique.invalid\" class=\"glyphicon glyphicon-warning-sign form-control-feedback\"></span><i ng-show=\"userNameUnique.pending\" class=\"glyphicon glyphicon-refresh fa-spin form-control-feedback\"></i><p ng-show=\"userNameUnique.valid\" class=\"alert alert-success\">\"{{userNameUnique.checkedValue}}\" is availiable.</p><p ng-show=\"userNameUnique.invalid\" class=\"alert alert-warning\">\"{{userNameUnique.checkedValue}}\" is not availiable.</p><button ng-disabled=\"the_form.$invalid || the_form.user_name.$pristine || userNameUnique.pending\" class=\"btn btn-default\">Submit</button></div></form><p>Original Value: {{originalValue}}</p><h3>Not Available:</h3><p ng-repeat=\"takenUserName in takenUserNames\">{{takenUserName}}</p>");}]);