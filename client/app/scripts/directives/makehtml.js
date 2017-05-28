'use strict';

/**
* @ngdoc directive
* @name clientApp.directive:makeHtml
* @description
* # makeHtml
*/
angular.module('clientApp')
.directive('makeHtml', function ($compile, $sce) {
    return {
        restrict: 'EA',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function(html) {
                var htmlElement = $sce.trustAsHtml(html);
                ele.html(htmlElement);
                $compile(ele.contents())(scope);
            });
        }
    };
});
