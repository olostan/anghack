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

        /*
        // This is hack... not universal
        client.on('disconnect', function() {
            if (!data.state || !data.state.value) return;
            var idx = data.state.value.players.reduce(function(pv,cv,i) { return cv.id==client.id?i:pv},-1);
            console.log("Logging off",idx);
            if (idx>=0) data.state.value.players.splice(idx,1);
        })*/

        // here we have client.id

        //client.on('message', function(message) {console.log(message)});

        //client.on('disconnect', function() {});

    });
}
