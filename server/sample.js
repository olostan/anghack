var dict = require('./dict.json');

module.exports = function (req, res, next) {
    console.log(res.end);
    if (req.url == '/sample') {
        res.setHeader('Content-Type', 'text/plain');
        var r = [];
        for (var x = 0;x<40;x++) {
            r.push(dict[Math.random()*dict.length|0]);
        }
        res.end(r.join(' '));
    } else
        next();

}