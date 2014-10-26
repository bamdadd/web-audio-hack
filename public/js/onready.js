$(document).ready(function() {

    $('#stop').click(function() {
        if(typeof audio != 'undefined') audio.stop();
    });

    $('#play').click(function() {
        play($('select').val());
    });

    $('#start').click(function(){
        start($('select').val());
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
            $('#stats').append(record+ ":" +data[record]);
        }
    }
});
