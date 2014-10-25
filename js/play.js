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