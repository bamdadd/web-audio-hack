var context = new webkitAudioContext();

oscillator = context.createOscillator(); // Oscillator defaults to sine wave
oscillator.connect(context.destination);
oscillator.noteOn(0);