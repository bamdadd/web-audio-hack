var bpm;
function Note(noteNumber,start_time){
    this.noteNumber = noteNumber;
    this.start_time = start_time;
    return {
        noteNumber: this.noteNumber,
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

    var tempo = _.select(midifile.tracks[0], function(e){return e.subtype ==  'setTempo'})[0];
        bpm = Math.round(60000000 / tempo.microsecondsPerBeat);
    console.log(bpm);
    _.each(midifile.tracks, function(track){
        timer = 0
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
    console.log((totalTicks*60)/tickesPerMinute);

}