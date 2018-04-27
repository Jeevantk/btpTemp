
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// var port = process.env.PORT || 3000;
var mysql = require('mysql');
var cors= require('cors')

var app = express();


var stateRouter = require('./stateRouter');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/state', stateRouter);


var router = express.Router();

// router(app);



var port = process.env.PORT || 6001;
var restPort = process.env.PORT || 3330;


var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "theeta",
  database: "btp"
});

connection.connect((err)=>{
  if(err) throw err;
  console.log('Connected to MYSQL Database');
});


app.listen(restPort,function(){
  console.log("Rest API endpoint Active at port %d",restPort);
})




app.use(function(req, res, next) {
    var error404 = new Error('Route Not Found');
    error404.status = 404;
    next(error404);
});

// error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



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

  socket.on('new Vibration',function(data){
    console.log("New Vibration Value Recieved ",data);
    socket.broadcast.emit("newVib",data);
  })

  socket.on('newControl',function(data){
    console.log("New Control Parameters Recieved ",data);
    socket.broadcast.emit("control",data);
    connection.query("SELECT * FROM currentPosition WHERE id = 1",function(err,result,fields){
      if(err) throw err;
      var xValue=parseInt(data.xValue)+parseInt(result[0].xValue);
      var yValue=parseInt(data.yValue)+parseInt(result[0].yValue);
      var zValue=parseInt(data.zValue)+parseInt(result[0].zValue);
      var queryString="UPDATE `currentPosition` SET `xValue`="+xValue+", `yValue`="+(yValue)+", `zValue`="+(zValue)+" WHERE `id`=1;";
      connection.query(queryString,function(err,result){
        if(err) throw err;
        console.log("State Updated");
        console.log("Trying to send data");
        socket.emit('reloadFlag',data);
      });
    });


    
  })



});

