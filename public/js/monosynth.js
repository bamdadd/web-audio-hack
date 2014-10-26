function MonoSynth(input, waveform) {

	var context = new webkitAudioContext();
	var oscillatorMap = {};

	input.addEventListener('note_down', function(note) {
		if(note in oscillatorMap) {
			oscillatorMap[note].stop();
		}

		oscillator = context.createOscillator();
    	oscillator.type = waveform;
    	oscillator.frequency.value = frequencyFromNoteNumber(note);
		oscillator.connect(context.destination);
		oscillator.start();
		oscillatorMap[note] = oscillator;
	});
	input.addEventListener('note_up', function(note) {
		if(note in oscillatorMap) {
			oscillatorMap[note].stop();
		}
	});

	function frequencyFromNoteNumber( note ) {
		return 440 * Math.pow(2,(note-69)/12);
	}

}