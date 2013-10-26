angular.module('game')
    .factory('socket', function($rootScope) {
        var socket = io.connect();

        var state = {connected:false}
        $rootScope.$socket = state;
        socket.on('connect', function() {
            $rootScope.$apply(function() { state.connected = true;});
        });
        socket.on('disconnect', function() {
             $rootScope.$apply(function() { state.connected = false;});
        });
        return socket;

    })
    .factory('shared', function ($rootScope,$q,socket) {

        return function (scope,name,scopeName) {
            var d = $q.defer();
            if (!scopeName) scopeName = name;
            socket.emit('get',name);
            var fromServer;
            var handler = function(data) {
                fromServer = angular.copy(data);
                scope.$apply(function() {
                    scope[scopeName] = data;
                    if (d) {
                        d.resolve(data);
                        d = undefined;
                    }
                });
            }
            socket.on('data.'+name, handler);
            scope.$watch(scopeName, function(nv) {
                if (nv==undefined ||  angular.equals(nv,fromServer)) { return;}
                fromServer = null;
                socket.emit('set', {name:name, data:nv});
            },true);

            scope.$on('$destroy', function() {
                socket.removeListener('data.'+name,handler);
            });
            return d.promise;
        }
    });