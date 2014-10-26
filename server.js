var express= require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var totalPlayers = 0;

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

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('join', function(msg){
        console.log('someone joined');
        totalPlayers++;
        if(totalPlayers >= 2){
            io.emit('midi-file', 'whistle.mid');
        }
    });

});


app.use(express.static('public'));


var server = http.listen(8888, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);

})