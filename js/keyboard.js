function Keyboard(element) {

	var octave = 6;
	var noteMap = {
		65: 0,
		87: 1,
		83: 2,
		69: 3,
		68: 4,
		70: 5,
		84: 6,
		71: 7,
		89: 8,
		72: 9,
		85: 10,
		74: 11,
		75: 12
	}

	var listeners = {'note_up': [], 'note_down': []};

	element.addEventListener('keydown', function(event) {
	    if(event.keyCode == 38) {
	        incrementOctave();
	    }
	    else if(event.keyCode == 40) {
	    	decrementOctave();
	    }
	    else if(event.keyCode in noteMap) {
	    	if(!event.repeat) {
	    		for(listener in listeners['note_down']) {
	    			listeners['note_down'][listener](getNote(event.keyCode));
	    		}
	    	}
	    }
	});

	element.addEventListener('keyup', function(event) {
	    if(event.keyCode in noteMap) {
	    	for(listener in listeners['note_up']) {
	    		listeners['note_up'][listener](getNote(event.keyCode));
	    	}
	    }
	});

	function getNote(keyCode) {
		return noteMap[keyCode]+(12*octave);
	}

	function incrementOctave() {
		if(octave<10) octave++;
	}

	function decrementOctave() {
		if(octave>0) octave--;
	}

	function addEventListener(noteEvent, callback) {
		if(noteEvent in listeners) {
			listeners[noteEvent].push(callback);
		}
	}

	return {
		addEventListener: function(noteEvent, callback) {
		if(noteEvent in listeners) {
			listeners[noteEvent].push(callback);
		}
	}
	}

}