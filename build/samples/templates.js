/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 9.3.2014
*/

angular.module("pmkr.componentsSamples").run(["$templateCache", function($templateCache) {$templateCache.put("directives/validateCustom/samples/userNameUnique.html","<form name=\"the_form\" class=\"form-group has-feedback\"><div ng-class=\"{\'has-success\':userNameUnique.valid, \'has-warning\':userNameUnique.invalid}\"><label for=\"user_name\">Username</label><input name=\"user_name\" ng-model=\"foo\" pmkr-validate-custom=\"{name:\'unique\', fn:check, gate:gate, wait:500, props:\'userNameUnique\'}\" pmkr-pristine-original=\"\" class=\"form-control\"/><span ng-show=\"userNameUnique.valid\" class=\"glyphicon glyphicon-ok form-control-feedback\"></span><span ng-show=\"userNameUnique.invalid\" class=\"glyphicon glyphicon-warning-sign form-control-feedback\"></span><i ng-show=\"userNameUnique.pending\" class=\"glyphicon glyphicon-refresh fa-spin form-control-feedback\"></i><p ng-show=\"userNameUnique.valid\" class=\"alert alert-success\">\"{{userNameUnique.checkedValue}}\" is availiable.</p><p ng-show=\"userNameUnique.invalid\" class=\"alert alert-warning\">\"{{userNameUnique.checkedValue}}\" is not availiable.</p><button ng-click=\"submit()\" ng-disabled=\"profile_form.$invalid || userNameUnique.pending\" class=\"btn btn-default\">Submit</button></div></form>");}]);