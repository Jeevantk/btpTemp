var SerialPort = require("serialport");

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var socketServer;
var serialPort;
var portName = '/dev/ttyACM0'; //change this to your Arduino port
var sendData = "";

// handle contains locations to browse to (vote and poll); pathnames.


var port = process.env.PORT || 6001;




server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


var receivedData = "";
serialPort = new SerialPort(portName, {
    baudRate: 9600,
    // defaults for Arduino serial communication
     dataBits: 8,
     parity: 'none',
     stopBits: 1,
     flowControl: false
});



io.on('connection', function (socket) {

	console.log("Connected to Client");
  // when the client emits 'new message', this listens and executes
  socket.on('collectData', function (data) {

    console.log("Data Collection message recieved ",data);
    serialPort.write(data+'E');
  });
});


var currentString="";
serialPort.on('open', function(){

	serialPort.on('data', function(data){
		// currentValue=data.toString('utf8');
		currentValue=data.toString();
		// console.log(currentString);
		if(currentValue.includes("\n")){
			currentString=currentString+currentValue;
			currentString=currentString.replace("\n",'');
			console.log("New Tempurature Sent from Client Side",parseFloat(currentString));

			currentString="";
		}
		else{
			currentString=currentString+currentValue;
		}
	});
});


