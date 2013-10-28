angular.module('game', ['shared'])
.controller('typer', function ($scope, shared, socket,$http) {
    var me,saver;

    shared($scope, 'state').then(function(s) {
        saver = s;
        if (!$scope.state) $scope.state = { players:[],mode:'waiting' }
        me = {
            id:socket.socket.sessionid,
            name: "Player"+(Math.random()*1024|0)
        };
        $scope.me = me;
        $scope.state.players.push(me);
    });
    $scope.$watch('me.ready', function(nv,ov) {
        if (!ov && nv) {
            if ($scope.state.players.filter(function(p) { return p.ready}).length == $scope.state.players.length) {
                $http.get('/sample').then(function(r) {
                    $scope.state.mode = 'started';
                    $scope.state.text = r.data;
                });
            }
        }
    });
    $scope.leave = function() {
        me.name += "[Q]";
        var idx = $scope.state.players.reduce(function(pv,cv,i) { return cv.id==me.id?i:pv},-1);
        if (idx>=0) $scope.state.players.splice(idx,1);
        saver();
    }
    $scope.clear = function() {
        $scope.state.players = [];
        $scope.state.mode='waiting';
    }
    $scope.$watch('state.players', function() {
        if (!$scope.state || !$scope.state.players) return;
        var idx = $scope.state.players.reduce(function(pv,cv,i) { return cv.id==me.id?i:pv},-1);
        $scope.inGame = idx>=0;

    });
    $scope.check = function(idx) {
        if (!me.text && idx==0) return 'current';
        if (!me.text || idx>me.text.length) return 'todo';
        if (idx==me.text.length) return 'current';
        if ($scope.state.text[idx]!=me.text[idx]) return 'incorrect';
        return 'correct';
    }
    $scope.calculate = function(player) {
        var completed = player.text?player.text.length/$scope.state.text.length*100|0:0;
        var mistakes = 0;
        if (me.text) {
            for (var i = 0;i<player.text.length;i++) {
                if ($scope.state.text[i]!=me.text[i]) mistakes++;
            }
        }
        if ( (completed == 100) && (mistakes == 0)) {
            player.winner = true;
            $scope.state.mode='won';
        }

        return completed+"% "+mistakes+" mistakes";
    }
});