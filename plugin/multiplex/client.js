(function() {
    // don't emit events from inside the previews themselves
    if ( window.location.search.match( /receiver/gi ) 
      || localStorage.secret == undefined
      || localStorage.secret == null
       ) {
        console.log('Configuring client mode');
        var multiplex = Reveal.getConfig().multiplex;
        var socketId = multiplex.id;
        var socket = io.connect(multiplex.url);

        socket.on(multiplex.id, function(data) {
        	// ignore data from sockets that aren't ours
        	if (data.socketId !== socketId) { return; }
        	if( window.location.host === 'localhost:1947' ) return;
        	Reveal.slide(data.indexh, data.indexv, null, 'remote');
        });
    }else{
        console.log('sending broadcaster tokens...');
        var multiplex = Reveal.getConfig().multiplex;
        var socket = io.connect(multiplex.url);

        Reveal.addEventListener( 'slidechanged', function( event ) {
        	var nextindexh;
        	var nextindexv;
        	var slideElement = event.currentSlide;

        	if (slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
        		nextindexh = event.indexh;
        		nextindexv = event.indexv + 1;
        	} else {
        		nextindexh = event.indexh + 1;
        		nextindexv = 0;
        	}

        	var slideData = {
        		indexh : event.indexh,
        		indexv : event.indexv,
        		nextindexh : nextindexh,
        		nextindexv : nextindexv,
        		secret: localStorage.secret,
        		socketId : multiplex.id
        	};

        	if( typeof event.origin === 'undefined' && event.origin !== 'remote' ) socket.emit('slidechanged', slideData);
        } );
    }
}());
