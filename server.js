var connect = require('connect');
var port = process.env.PORT || 3333;

var c = connect();

c.use(connect.static('./client'));
c.use(connect.directory('./client/'));
c.use(require('./server/ip')(port))

var server = require('http').createServer(c);

require('./server/socket')(server);

server.listen(port);

console.log("Listening on ", port);