var bpm;
function Note(noteNumber,start_time){

    var noteArray = ['C', 'C#/Db', 'D', 'D#/Eb','E','F', 'F#/Gb','G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

    function noteMapper(noteNumber) {
        return noteArray[noteNumber % 12] + " - " + Math.floor(noteNumber/12);
    }

    this.noteNumber = noteNumber;
    this.noteName = noteMapper(noteNumber);
    this.start_time = start_time;
    return {
        noteNumber: this.noteNumber,
        noteName: this.noteName,
        end_time: this.end_time,
        start_time: this.start_time
    }

}
var unfinished_notes = {};
var notes = [];

function NoteRepo(type, noteNumber, timer){

    if (type == 'start'){
        var start_note = Note(noteNumber, timer);
        unfinished_notes[noteNumber] = start_note;

    }
    if (type == 'finish'){
        unfinished_notes[noteNumber].end_time = timer;
        notes.push(unfinished_notes[noteNumber]);

    }
}

function Visualiser(midifile, callback){
    var ticksPerBeat = midiFile.header.ticksPerBeat;
    notes = [];

    var tempo = _.select(midifile.tracks[0], function(e){return e.subtype ==  'setTempo'})[0];
        bpm = Math.round(60000000 / tempo.microsecondsPerBeat);
    _.each(midifile.tracks, function(track){
        timer = 1000;
        events = _.filter(track, function(e){return e.subtype== 'noteOn' || e.subtype == 'noteOff'})
        _.each(events, function(e){
            timer += e.deltaTime;
                if (e.subtype == 'noteOn'){
                    NoteRepo('start', e.noteNumber, timer)
                }
                if (e.subtype == 'noteOff'){
                    NoteRepo('finish', e.noteNumber, timer)
                }

        })
    });

    var tickesPerMinute = (ticksPerBeat * bpm);
    var totalTicks = notes[notes.length - 1].end_time;
}