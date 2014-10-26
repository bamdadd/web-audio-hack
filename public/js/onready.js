$(document).ready(function() {

    $('#stop').click(function() {
        if(typeof audio != 'undefined') audio.stop();
    });

    $('#play').click(function() {
        play($('select').val());
    });

    $('#start-game').click(function(){
        start($('select').val());
    });

    $('#stop-game').click(function(){
        stop();
    });

    if(FileReader){
        function cancelEvent(e){
            e.stopPropagation();
            e.preventDefault();
        }
        document.addEventListener('dragenter', cancelEvent, false);
        document.addEventListener('dragover', cancelEvent, false);
        document.addEventListener('drop', function(e){
        cancelEvent(e);
        }, false);
    }

    $.get('/stats', {}, function(d){
        updateStats(d);
    })

    function updateStats(data){
        for(record in data){
            $('#stats').append(record+ ":" +data[record]+"</br>");
        }
    }

    $('#join').click(function(){
        socket.emit('join');
    })

    socket.on('midi-file', function(midiFile){
        console.log(midiFile);
        start(midiFile);
    })
});
