var notesToVisualise = [];


var keyboard = Keyboard(document);
var mono = MonoSynth(keyboard, 1);

function drawChart() {
    $('.chart').remove();

    var noteNumbers = [];


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

    var gantt = d3.gantt().noteAxisNumbers(noteNumbers).tickFormat(format);

//    first_half = notesToVisualise.slice(0, notesToVisualise.length / 2);
//    second_half = notesToVisualise.slice(notesToVisualise.length / 2, notesToVisualise.length - 1);

    gantt(notesToVisualise);

//    setTimeout(function () {
//        gantt.redraw(second_half);
//    }, 5000);
}



