var notesToVisualise = [];

var keyboard = Keyboard(document);
var mono = MonoSynth(keyboard, 1);

function Game(notes, keyboard){
    var notes_to_play = (_.map(notes, function(i){
        return i.noteNumber}));
    var notes_played = [];
    var note_index = 0;
    var score = 0;
    var mistakes = 0;

    var showDialog = function (text){
        $('#alert-msg').text(text);
        $('#alert').show()
    }

    var updateScore= function(){
        $('#score').text(score);
    }
    var updateMistakes= function(){
        $('#mistakes').text(mistakes);
    }
    console.log(notes_to_play);
    keyboard.addEventListener('note_down', function(note){
        if(notes_to_play[note_index] == note){
            score  = score+10;
            updateScore();
            note_index++;
            if(note_index == (notes_to_play.length)) {
                showDialog('You Won!!!Whoohoo. Enter you name below to upload your score:');
            }
        }
        else{
            mistakes++;
            updateMistakes();
            if (mistakes > 4 ){
            showDialog('You made 5 mistakes. Enter your name and upload your high score to see who plays better between your friends and try again.');

            }
        }
    })
}

var gantt;
function drawChart() {
    $('.chart').remove();

    notesToVisualise = [];

    var noteNumbers = [];

    Game(notes, keyboard);

    notes.sort(function (a, b) {
        return a.noteNumber - b.noteNumber;
    });


    for (var i = notes[0].noteNumber; i <= notes[notes.length - 1].noteNumber; i++) {
        noteNumbers.push(i);
    };


    _.each(notes, function (note) {
        notesToVisualise.push({
            startTime: note.start_time,
            endTime: note.end_time,
            noteNumber: note.noteNumber,
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
    

    rollNotes = true;
    var move = function() {
        gantt.redraw(notesToVisualise);
        setTimeout(function () {
            if(!gantt.atEnd() && rollNotes) move();
            else console.log("stop");
        }, 33);
    }

    move();

}

