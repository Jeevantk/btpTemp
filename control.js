var SerialPort = require("serialport")
var mysql = require('mysql');
var socket = require('socket.io-client')('http://34.212.83.92:6001');
var fs = require('fs');

// file is included here:
eval(fs.readFileSync('statsmodels.js')+'');
// var socket = require('socket.io-client')('http://127.0.0.1:6001');

// console.log(" Array values ",arr.variance([2,3]))
var createTemp = "CREATE TABLE IF NOT EXISTS `tempurature`(`id` int(11) NOT NULL AUTO_INCREMENT,`tempValue` real  NOT NULL,PRIMARY KEY (`id`));";


var portNameCurrent = '/dev/ttyACM0';

var portTemp = '/dev/ttyUSB0';

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

var serialPortCurrent;

var serialPortTemp;

serialPortCurrent = new SerialPort(portNameCurrent, {
    baudRate: 9600,
    // defaults for Arduino serial communication
     dataBits: 8,
     parity: 'none',
     stopBits: 1,
     flowControl: false
});

serialPortTemp = new SerialPort(portTemp, {
    baudRate: 9600,
    // defaults for Arduino serial communication
     dataBits: 8,
     parity: 'none',
     stopBits: 1,
     flowControl: false
});



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
});

socket.on('experimentParams',function(data){
	console.log("Experiment Params Recieved ",data);
	serialPortCurrent.write(data.toString());
});

var currentTempString="";
serialPortTemp.on('open',function(){
  serialPortTemp.on('data',function(data){
    var currentTempValue=data.toString();
    if(currentTempValue.includes("\n")){
      currentTempString=currentTempString+currentTempValue;
      currentTempString=currentTempString.replace("\n",'');
      socket.emit('new tempurature',parseFloat(currentTempString));
      console.log("New Tempurature Send from local Machine ",currentTempString);
      // Add Code For Adding the tempurature value into the database.
      currentTempString="";
    }
    else{
      currentTempString=currentTempString+currentTempValue;
    }
  });
});

var currentValues=[];
var currentCurrentString="";
serialPortCurrent.on('open',function(){
  serialPortCurrent.on('data',function(data){
    var currentCurrentValue=data.toString();
    if(currentCurrentValue.includes("\n")){
      currentCurrentString=currentCurrentString+currentCurrentValue;
      currentCurrentString=currentCurrentString.replace("\n",'');
      currentValues.push(parseFloat(currentCurrentString));
      // console.log("New Tempurature Send from local Machine ",currentCurrentString);
      // Add Code For Adding the tempurature value into the database.
      currentCurrentString="";
    }
    else{
      currentCurrentString=currentCurrentString+currentCurrentValue;
    }
    if(currentValues.length==1000)
    {
      var variance = arr.variance(currentValues);
      socket.emit('new Current',variance);
      console.log("New Tempurature Variance send from local Machine ",variance);
      currentValues=[];
    }
  });
});


// var k=1;
// function sendCurrentValues(){
//   socket.emit("new Current",k);
//   k=k*2;
// }
// setInterval(sendCurrentValues,2000);



// var currentString="";
// myPort.on('open', function(){
// 	// console.log('Serial Port Opened');
// 	myPort.on('data', function(data){
// 		// currentValue=data.toString('utf8');
// 		if(write){
// 			currentValue=data.toString();
// 			// console.log(currentString);
// 			if(currentValue.includes("\n")){
// 				currentString=currentString+currentValue;
// 				currentString=currentString.replace("\n",'');
// 				// console.log(parseFloat(currentString));
// 				//socket.emit('new tempurature', parseFloat(currentString));
// 				console.log("New Tempurature Sent from Client Side",parseFloat(currentString));
// 				connection.query('INSERT INTO tempurature (tempValue) VALUES (?)',parseFloat(currentString),function(err,result){
// 					if(err) throw err;
// 					console.log("Inserted tempurature into database ");
// 				});
// 				currentString="";
// 			}
// 			else{
// 				currentString=currentString+currentValue;
// 			}
// 		}

// 	});
// });

