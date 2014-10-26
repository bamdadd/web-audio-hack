var express = require('express')
var app = express()

var scoreMap = {'Bamdad': 25};

app.get('/stats', function (req, res) {
    res.json(scoreMap);
})

app.post('/stat', function (req, res) {
    console.log(req.body);
    res.send('updated');
})


app.use(express.static('public'));


var server = app.listen(8888, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);

})