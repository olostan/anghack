angular.module('game').controller('game', function ($scope, shared, socket) {
    var myId = socket.socket.sessionid;
    var me = {id: myId, text: ''}

    shared($scope, 'game.' + $scope.state.gameName, 'game').then(function (g) {
        if (!g) {
            $scope.game = { players: []};
            console.log("initialized game", $scope.state.gameName);
        }
        $scope.game.players.push(me);
        $scope.me = me;
    });
    $scope.leave = function () {
        var n = $scope.game.players.indexOf(myId);
        if (n >= 0) {
            $scope.game.players.splice(n, 1);
            $scope.state.template = 'list.html';
        }
    }
    $scope.myId = myId;
    $scope.start = function () {
        $scope.game.started = true;
        $scope.game.text = generateRandomText();
    }
    function generateRandomText() {
        return "test test test";
    }


});