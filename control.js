var SerialPort = require("serialport");
var mysql = require('mysql');
var socket = require('socket.io-client')('http://34.212.83.92:6001');

// var socket = require('socket.io-client')('http://127.0.0.1:6001');

var spawn = require("child_process").spawn;

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


socket.on('connect',function(){
	console.log("Local Machine is connected to the server");
});


connection.query(createTemp, function(err,results,fields){
  if(err)
  {
  	console.log(err.message);
  }
});

socket.on('control',function(data) {

    console.log('Received Control Message Recieved from the server! ',data);
    var xMotion=Math.min(data.xValue,30);
    var yMotion=Math.min(data.yValue,60);
    var zMotion=Math.min(data.zValue,30);
    var feedRate=Math.min(data.feedRate,300);
    spawn('python',["control.py",xMotion,yMotion,zMotion,feedRate]);

    // spawn('python',["control.py",data.xValue,data.yValue,data.zValue,data.feedRate]);
      // console.log(data.xValue);
});
var write=0;

socket.on('startStop',function(data){
	if(data==1)
	{
		write=1;
	}
	else if(data==0)
	{
		write=0;
	}

});

var currentString="";
myPort.on('open', function(){
	// console.log('Serial Port Opened');
	myPort.on('data', function(data){
		// currentValue=data.toString('utf8');
		if(write){
			currentValue=data.toString();
			// console.log(currentString);
			if(currentValue.includes("\n")){
				currentString=currentString+currentValue;
				currentString=currentString.replace("\n",'');
				// console.log(parseFloat(currentString));
				//socket.emit('new tempurature', parseFloat(currentString));
				console.log("New Tempurature Sent from Client Side",parseFloat(currentString));
				connection.query('INSERT INTO tempurature (tempValue) VALUES (?)',parseFloat(currentString),function(err,result){
					if(err) throw err;
					console.log("Inserted tempurature into database ");
				});
				currentString="";
			}
			else{
				currentString=currentString+currentValue;
			}
		}

	});
});

