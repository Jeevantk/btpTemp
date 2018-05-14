var socket = require('socket.io-client')('http://34.212.83.92:6001');

socket.on('connect',function(){
	console.log("Local Machine is connected to the server");
});



// socket.emit('new Current',{"variance":10,"value":64});

socket.emit('new tempurature',20);



