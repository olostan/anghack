angular.module('game').directive('unload', function($window) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, iElem, iAttr) {
            console.log('linking');
            angular.element($window).bind('beforeunload', function() {
                //scope.$eval('leave()');
                scope.leave();
                return false;
            });

        }
    }
})