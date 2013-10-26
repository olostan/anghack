angular.module('game')
    .controller('list', function ($scope, shared) {
        shared($scope, 'games').then(function (data) {
            if (data == undefined) {
                $scope.games = [];
            }
        });

        $scope.addGame = function (name) {
            if ($scope.games.filter(function (g) {
                return g.name == name
            }).length == 0)
                $scope.games.push({name: name});
        }
        $scope.join = function (game) {
            $scope.state.gameName = game.name;
            $scope.state.template = 'game.html';
        }
    })