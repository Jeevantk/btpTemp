
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var port = process.env.PORT || 3000;


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


  socket.on('new Current',function(data){
  	console.log("New Current Value Recieved ",data);
  	socket.broadcast.emit('newCurrent',data)
  });
  

  socket.on('new rpm',function(data){
  	console.log("New RPM Value Recieved ",data);
  	socket.broadcast.emit("newrpm",data);
  });



});
