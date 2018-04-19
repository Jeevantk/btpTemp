var mysql = require('mysql');


// var socket = require('socket.io-client')('http://34.212.83.92:6001');
var socket = require('socket.io-client')('http://localhost:6001');

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

var createTemp = "CREATE TABLE IF NOT EXISTS `current`(`id` int(11) NOT NULL AUTO_INCREMENT,`currentValue` real  NOT NULL,PRIMARY KEY (`id`));";


connection.query(createTemp, function(err,results,fields){
  if(err)
  {
  	console.log(err.message);
  }
});


///DATA
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(function(){
	var data = getRandomInt(10,100);
	// var data=sinewave(i)+30;
	socket.emit('new Current', data);
	console.log("New Current Sent from Client Side",data);
	connection.query('INSERT INTO current (currentValue) VALUES (?)',data,function(err,result){
		if(err) throw err;
		console.log("Inserted current into database ",data);
	});
},1000);	
