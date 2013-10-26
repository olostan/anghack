var ip;
var interfaces = require('os').networkInterfaces();
for (var ifName in interfaces) {
    var i = interfaces[ifName];
    i.forEach(function (r) {
        if (r.family == 'IPv4' && r.address.substr(0, 3) != '127') {
            ip = r.address;

        }
    })
}

module.exports = function(port) {
    return function (req, res, next) {
        console.log(res.end);
        if (req.url == '/ip.json') {
            res.setHeader('Content-Type', 'application/json');
            res.end('{ "ip": "' + ip + '","port":"' + port + '" }');
        } else
            next();
    }
}