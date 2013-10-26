var io = require('socket.io');

module.exports = function (server) {

    var socket = io.listen(server);

    var data = {server:{type:'boolean',value:true}};

    socket.on('connection', function (client) {

        client.on('get', function (name) {
            var result = data[name];
            if (!result) result = {type:'undefined'};
            console.log("respond to",name,"as",result);
            client.emit('data.' + name, result);
        })

        client.on('set', function (r) {
            console.log("setting ",r.name," to ",r.data);
            data[r.name] = r.data;
            client.broadcast.emit('data.' + r.name, r.data);
        })

        // here we have client.id

        //client.on('message', function(message) {console.log(message)});

        //client.on('disconnect', function() {});

    });
}
