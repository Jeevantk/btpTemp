var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var cors= require('cors')

var app = express();
var stateRouter = require('./stateRouter');

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

// app.use(function(req, res, next) {
//     var error404 = new Error('Route Not Found');
//     error404.status = 404;
//     next(error404);
// });



// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(restPort,function(){
  console.log("Rest API endpoint Active at port %d",restPort);
});



