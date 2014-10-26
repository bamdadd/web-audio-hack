function NoteStream() {

	var listeners = {'note_up': [], 'note_down': []};

	// Listen for note input and fire off note_up or down events

	return {
		addEventListener: function(noteEvent, callback) {
			if(noteEvent in listeners) {
				listeners[noteEvent].push(callback);
			}
		}
	}
}