var express = require( "express" );
var app = express();
var http = require( "http" );
app.use( express.static( "./public" ) ); // where the web page code goes
var http_server = http.createServer( app ).listen( 4000 );
var http_io = require( "socket.io" )( http_server );

http_io.on( "connection", function( httpsocket ) {
	console.log("Connected to the client");
    httpsocket.on( 'python-message', function( fromPython ) {
    	console.log(fromPython);
        httpsocket.broadcast.emit( 'vibrationData', fromPython );
    });
});
















// var express = require('express');
// var app = express();
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);


// var port = process.env.PORT || 6001;


// server.listen(port, function () {
//   console.log('Server listening at port %d', port);
// });


// io.on('connection', function (socket) {

//   // when the client emits 'new message', this listens and executes
//   socket.on('pythonMessage', function (data) {
//     // we tell the client to execute 'new message'
// 	console.log("New python message recieved ",data);
//   });

// });