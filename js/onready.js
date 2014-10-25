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
