var SerialPort = require("serialport");
var socket = require('socket.io-client')('http://34.212.83.92:6001');

// var socket = require('socket.io-client')('http://127.0.0.1:6001');

var spawn = require("child_process").spawn;



socket.on('connect',function(){
	console.log("Local Machine is connected to the server");
});

socket.on('control',function(data) {
      console.log('Received Control Message Recieved from the server! ',data);
      spawn('python',["control.py",data.xValue,data.yValue,data.zValue,data.feedRate]);
      // console.log(data.xValue);
});


// socket.on('newComand', function (data) {
// 	// Check if a new command has been excecuted

// 	console.log("New tempurature Recieved ",data);
// 	socket.broadcast.emit('newTemp', data);
// });