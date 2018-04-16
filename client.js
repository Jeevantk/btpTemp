var socket = require('socket.io-client')('http://localhost:3000');


///DATA
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(function(){
	var data = getRandomInt(10,100);
	// var data=sinewave(i)+30;
	socket.emit('new tempurature', data);
	console.log("New Tempurature Sent from Client Side",data);
},1000);