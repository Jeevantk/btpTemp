var mysql = require('mysql');
var SerialPort = require("serialport");
var socket = require('socket.io-client')('http://34.212.83.92:6001');

// var socket = require('socket.io-client')('http://localhost:6001');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password : 'theeta',
	database : 'btp'
});

connection.connect((err)=>{
	if(err) throw err;
	console.log('Connected to MYSQL Database');
});

var createTemp = "CREATE TABLE IF NOT EXISTS `tempurature`(`id` int(11) NOT NULL AUTO_INCREMENT,`tempValue` real  NOT NULL,PRIMARY KEY (`id`));";

var myPort = new SerialPort('/dev/ttyACM0', {
    parser: new SerialPort.parsers.Readline('\n')
},false);

connection.query(createTemp, function(err,results,fields){
  if(err)
  {
  	console.log(err.message);
  }
});



var currentString="";
myPort.on('open', function(){
	// console.log('Serial Port Opened');
	myPort.on('data', function(data){
		// currentValue=data.toString('utf8');
		currentValue=data.toString();
		// console.log(currentString);
		if(currentValue.includes("\n")){
			currentString=currentString+currentValue;
			currentString=currentString.replace("\n",'');
			// console.log(parseFloat(currentString));
			socket.emit('new tempurature', parseFloat(currentString));
			console.log("New Tempurature Sent from Client Side",parseFloat(currentString));
			// connection.query('INSERT INTO tempurature (tempValue) VALUES (?)',parseFloat(currentString),function(err,result){
			// 	if(err) throw err;
			// 	console.log("Inserted tempurature into database ",parseFloat(currentString));
			// });
			currentString="";
		}
		else{
			currentString=currentString+currentValue;
		}
	});
});


///DATA
// function getRandomInt(min, max) {
// 	return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// setInterval(function(){
// 	var data = getRandomInt(10,100);
// 	// var data=sinewave(i)+30;
// 	socket.emit('new tempurature', data);
// 	console.log("New Tempurature Sent from Client Side",data);
// 	connection.query('INSERT INTO tempurature (tempValue) VALUES (?)',data,function(err,result){
// 		if(err) throw err;
// 		console.log("Inserted tempurature into database ",data);
// 	});
// },1000);	


