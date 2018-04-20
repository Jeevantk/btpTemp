var SerialPort = require("serialport");
var socket = require('socket.io-client')('http://34.212.83.92:6001');

var spawn = require("child_process").spawn;

spawn('python',["control.py",-10,3,-5]);


// socket.on('newComand', function (data) {
// 	// Check if a new command has been excecuted

// 	console.log("New tempurature Recieved ",data);
// 	socket.broadcast.emit('newTemp', data);
// });