var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


var port = process.env.PORT || 6001;




server.listen(port, function () {
  console.log('Server listening at port %d', port);
});



io.on('connection', function (socket) {

  // when the client emits 'new message', this listens and executes
  socket.on('new tempurature', function (data) {
    // we tell the client to execute 'new message'

    console.log("New tempurature Recieved ",data);
    socket.broadcast.emit('newTemp', data);
  });

  socket.on('collectData',function(data){
    console.log('Command Recieved for Collect Data ',data);
    socket.broadcast.emit('experimentParams',data);
  });


  socket.on('new Current',function(data){
  	console.log("New Current Value Recieved ",data);
  	socket.broadcast.emit('newCurrent',data)
  });
  

  socket.on('new rpm',function(data){
  	console.log("New RPM Value Recieved ",data);
  	socket.broadcast.emit("newrpm",data);
  });

  socket.on('new Vibration',function(data){
    console.log("New Vibration Value Recieved ",data);
    socket.broadcast.emit("newVib",data);
  })

  socket.on('newControl',function(data){
    console.log("New Control Parameters Recieved ",data);
    socket.broadcast.emit("control",data);    
  })



});

