var notesToVisualise = [];

var keyboard = Keyboard(document);
var mono = MonoSynth(keyboard, 1);

function shareScore(){
    $.post('http://localhost:8888/stat',{
        name: $('.name').val(),
        score: $('#score').text()

    },function(d){
        console.log(d);
    });
}



function Game(notes, keyboard){
    var notes_to_play = (_.map(notes, function(i){
        return i.noteNumber}));
    var notes_played = [];
    var note_index = 0;
    var score = 0;
    var mistakes = 0;
    var gameActive = false;

    var showDialog = function (text){
        $('#alert-msg').html(text);
        $('#alert').show()
        $('#submit-score').text($('#score').text());
    }

    var updateScore= function(){
        $('#score').text(score);
    }
    updateScore();

    var updateMistakes= function(){
        $('#mistakes').text(mistakes);
    }
    updateMistakes();

    var endGame = function() {
        $('.chart').remove();
        gameActive = false;
    };

    var startGame = function() {

        notesToVisualise = [];

        var noteNumbers = [];

        notes.sort(function (a, b) {
            return a.noteNumber - b.noteNumber;
        });


        for (var i = 0; i <notes.length; i++) {
            noteNumbers.push(notes[i].noteName);
        };


        _.each(notes, function (note) {
            notesToVisualise.push({
                startTime: note.start_time,
                endTime: note.end_time,
                noteNumber: note.noteName,
                status: "note-" + note.noteNumber
            })
        });

        notesToVisualise.sort(function (a, b) {
            return a.endTime - b.endTime;
        });
        var maxDate = notesToVisualise[notesToVisualise.length - 1].endTime;
        notesToVisualise.sort(function (a, b) {
            return a.startTime - b.startTime;
        });
        var minDate = notesToVisualise[0].startTime;

        var format = "%H:%M";

        gantt = d3.gantt().noteAxisNumbers(noteNumbers).tickFormat(format);

        // first_half = notesToVisualise.slice(0, notesToVisualise.length / 2);
        // second_half = notesToVisualise.slice(notesToVisualise.length / 2, notesToVisualise.length - 1);

        gantt(notesToVisualise);


        gameActive = true;
        var move = function() {
            gantt.redraw(notesToVisualise);
            setTimeout(function () {
                if(!gantt.atEnd() && gameActive) move();
                else endGame();
            }, 33);
        }

        move();
    };


    keyboard.addEventListener('note_down', function(note){
        if(notes_to_play[note_index] == note){
            score  = score+10;
            updateScore();
            note_index++;
            if(note_index == (notes_to_play.length)) {
                keyboard.disable();
                endGame();
                showDialog('<p>You Won!!!<br/>Whoohoo. </p><p>Enter you name below to upload your score:<br/></p>');
            }
        }
        else{
            mistakes++;
            updateMistakes();
            if (mistakes > 4 ){
                keyboard.disable();
                endGame();
                showDialog('<p>You made 5 mistakes.<br/> </p><p>Enter your name and upload your high score to see who plays better between your friends and try again.<br/></p>');
            }
        }
    })

    return {
        startGame: startGame,
        endGame: endGame
    }
}

var gantt;


