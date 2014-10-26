var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


var scoreMap = {};

app.get('/stats', function (req, res) {
    res.json(scoreMap);
})

app.post('/stat', function (req, res) {
    name = req.body.name;
    score = req.body.score;
    scoreMap[name] = score;

    res.send('updated');
})


app.use(express.static('public'));


var server = app.listen(8888, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);

})