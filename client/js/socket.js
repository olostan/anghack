angular.module('shared',[])
    .factory('socket', function ($rootScope) {
        var socket = io.connect();

        var state = {connected: false};
        $rootScope.$socket = state;
        socket.on('connect', function () {
            $rootScope.$apply(function () {
                state.connected = true;
            });
        });
        socket.on('disconnect', function () {
            $rootScope.$apply(function () {
                state.connected = false;
            });
        });
        return socket;

    })
    .factory('shared', function ($rootScope, $q, socket) {

        function initByType(type) {
            switch (type) {
                case 'string':
                    return "";
                case 'object':
                    return {};
                case 'array':
                    return [];
            }
            return undefined;
        }

        function getType(nv) {
            if (angular.isArray(nv)) return 'array';
            else return typeof(nv);
        }

        return function (scope, name, scopeName) {
            var d = $q.defer();
            if (!scopeName) scopeName = name;
            socket.emit('get', name);
            var ignore = false;
            var save = function () {
                var nv = scope[scopeName];
                socket.emit('set', {name: name, data: {value: nv, type: getType(nv)}});
            }
            var handler = function (data) {
                scope.$apply(function () {
                    if (!scope[scopeName])
                        scope[scopeName] = initByType(data.type);
                    //angular.
                    if (data.type=='object'||data.type=='array')
                        copy(data.value, scope[scopeName]);
                    else
                        scope[scopeName] = data.value;
                    ignore = angular.copy(data.value);
                    if (d) {
                        d.resolve(save);
                        d = undefined;
                    }
                });
            };
            socket.on('data.' + name, handler);
            scope.$watch(scopeName, function (nv, ov) {
                if (ignore && angular.equals(nv, ignore)) {
                    return ignore = undefined;
                }
                if (nv === ov) {
                    return;
                }
                save();
            }, true);

            scope.$on('$destroy', function () {
                socket.removeListener('data.' + name, handler);
            });
            return d.promise;
        }
    });

function copy(source, destination) {
    /*    if (angular.isWindow(source) || angular.isScope(source)) {
     throw "Can't copy! Making copies of Window or Scope instances is not supported.";
     }*/

    if (!destination) {
        destination = source;
        if (source) {
            if (angular.isArray(source)) {
                destination = copy(source, []);
            } else if (angular.isDate(source)) {
                destination = new Date(source.getTime());
//            } else if (angular.isRegExp(source)) {
//                destination = new RegExp(source.source);
            } else if (angular.isObject(source)) {
                destination = copy(source, {});
            }
        }
    } else {
        if (angular.isObject(source) && source === destination) throw "Can't copy! Source and destination are identical.";
        if (angular.isArray(source)) {
            /*destination.length = 0;
             for ( var i = 0; i < source.length; i++) {
             destination.push(copy(source[i]));
             } */
            destination.length = source.length;
            for (var i = 0; i < source.length; i++) {
                if (typeof(source[i]) == 'object' && typeof(destination[i]) == 'object')
                    copy(source[i], destination[i])
                else destination[i] = source[i];
            }

        } else {
            var h = destination.$$hashKey;
            angular.forEach(destination, function (value, key) {
                if (source[key]) {
                    if (angular.isObject(source[key]) || angular.isArray(source[key]))
                        copy(source[key], destination[key])
                    else destination[key] = source[key];
                }
                else delete destination[key];
            });
            for (var key in source) {
                if (!destination[key]) destination[key] = copy(source[key]);
            }
            setHashKey(destination, h);

        }
    }
    return destination;
}
function setHashKey(obj, h) {
    if (h) {
        obj.$$hashKey = h;
    }
    else {
        delete obj.$$hashKey;
    }
}