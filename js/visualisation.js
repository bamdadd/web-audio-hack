var tasks = [];

function loadRemote(path, callback) {
    var fetch = new XMLHttpRequest();
    fetch.open('GET', path);
    fetch.overrideMimeType("text/plain; charset=x-user-defined");
    fetch.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            /* munge response into a binary string */
            var t = this.responseText || "" ;
            var ff = [];
            var mx = t.length;
            var scc= String.fromCharCode;
            for (var z = 0; z < mx; z++) {
                ff[z] = scc(t.charCodeAt(z) & 255);
            }
            callback(ff.join(""));
        }
    }
    fetch.send();
}

function play(file) {
    loadRemote(file, function(data) {
        midiFile = MidiFile(data);
        visualiser = Visualiser(midiFile);
        drawChart();
        synth = Synth(44100);
        replayer = Replayer(midiFile, synth);
        audio = AudioPlayer(replayer);
    })
}

function drawChart() {
    var taskNames = [];


    notes.sort(function(a, b) {
        return a.noteNumber - b.noteNumber;
    });


    for(var i=notes[0].noteNumber; i <= notes[notes.length-1].noteNumber; i++) {
        taskNames.push(i);
    };

    now = new Date();

    for(note in notes) {
        tasks.push({
            startDate: new Date(notes[note].start_time),
            endDate: new Date(notes[note].end_time),
            taskName: notes[note].noteNumber,
            status:"note-"+notes[note].noteNumber
        });

    }

    tasks.sort(function(a, b) {
        return a.endDate - b.endDate;
    });
    var maxDate = tasks[tasks.length - 1].endDate;
    tasks.sort(function(a, b) {
        return a.startDate - b.startDate;
    });
    var minDate = tasks[0].startDate;

    var format = "%H:%M";

    var gantt = d3.gantt().taskTypes(taskNames).tickFormat(format);
    gantt(tasks);
}
$(document).ready(function() {

    if(FileReader){
        function cancelEvent(e){
            e.stopPropagation();
            e.preventDefault();
        }
        document.addEventListener('dragenter', cancelEvent, false);
        document.addEventListener('dragover', cancelEvent, false);
        document.addEventListener('drop', function(e){
            cancelEvent(e);
            for(var i=0;i<e.dataTransfer.files.length;++i){
                var
                    file = e.dataTransfer.files[i]
                    ;
                if(file.type != 'audio/midi'){
                    continue;
                }
                var
                    reader = new FileReader()
                    ;
                reader.onload = function(e){
                    midiFile = MidiFile(e.target.result);
                    synth = Synth(44100);
                    replayer = Replayer(midiFile, synth);
                    audio = AudioPlayer(replayer);
                };
                reader.readAsBinaryString(file);
            }
        }, false);
    }
});



