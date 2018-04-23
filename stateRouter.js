var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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



router.get('/get', function(req, res, next) {

  connection.query("SELECT * FROM currentPosition WHERE id = 1",function(err,result,fields){
    	if(err) throw err;
    	var currentState={"xValue":result[0].xValue,"yValue":result[0].yValue,"zValue":result[0].zValue};
    	res.send(currentState);
    	console.log(currentState)
  }); 
});


router.post('/update',function(req,res){
	var queryString="UPDATE `currentPosition` SET `xValue`="+req.body.xValue+", `yValue`="+req.body.yValue+", `zValue`="+req.body.zValue+" WHERE `id`=1;";
	connection.query(queryString,function(err,result){
		if(err) throw err;
		console.log("State Updated");
	});
	console.log(req.body.xValue);

});



module.exports = router