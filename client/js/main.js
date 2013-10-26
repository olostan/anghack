angular.module('game',['ngAnimate'])
.controller('main',function($scope,shared){
    $scope.state = {};
    $scope.$watch('$socket.connected', function(nv,ov) {
        if (nv && !ov) $scope.state.template = 'list.html';
    });
    shared($scope, 'test');

})