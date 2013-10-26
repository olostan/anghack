angular.module('game').controller('game', function($scope,shared,socket) {
    var myId = socket.socket.sessionid;
    shared($scope,'game.'+$scope.state.gameName, 'game').then(function(g) {
        if (g==null) {
            $scope.game = { players:[]};
            console.log("initialized game", $scope.state.gameName);
        }
        $scope.game.players.push(myId);
    });
    $scope.leave = function() {
        var n = $scope.game.players.indexOf(myId);
        if (n>=0) {
            $scope.game.players.splice(n,1);
            $scope.state.template = 'list.html';
        }
    }
    $scope.myId = myId;

});