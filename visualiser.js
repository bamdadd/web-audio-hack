function Note(noteNumber,start_time){
    this.noteNumber = noteNumber;
    this.start_time = start_time;
    return {
        noteNumber: this.noteNumber,
        end_time: this.end_time,
        start_time: this.start_time

    }

}
var unfinished_notes = []
var notes = []

function NoteRepo(type, noteNumber, timer){

    if (type == 'start'){
        var start_note = Note(noteNumber, timer);
        unfinished_notes.push(start_note);

    }
    if (type == 'finish'){
        note_to_finish = _.find(unfinished_notes, function(n){ return n.noteNumber == noteNumber });
        note_to_finish.end_time = timer;
        notes.push(note_to_finish);
    }
    // console.log(notes);

}

function Visualiser(midifile, callback){
    timer = 0
    _.each(midifile.tracks, function(track){
        events = _.filter(track, function(e){return e.subtype== 'noteOn' || e.subtype == 'noteOff'})
        _.each(events, function(e){
            timer += e.deltaTime;
            // console.log(e);
            if (e.subtype == 'noteOn'){
                NoteRepo('start', e.noteNumber, timer)
            }
            if (e.subtype == 'noteOff'){
                NoteRepo('finish', e.noteNumber, timer)
            }
        })
    });

}