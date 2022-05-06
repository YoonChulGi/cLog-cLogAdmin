var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
var databaseUrl = 'mongodb://localhost:27017/local';
let database;

let Schema;

let Model;

mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
mongoose.connect(databaseUrl);
database = mongoose.connection;
database.on('error',console.error.bind(console,'mongoose connection error.'));
database.on('open',function(){
	console.log('DB is connected: '+databaseUrl);
	
});
createSchema();



route.get('/',(req,res)=>{
	let paramUid = req.body.uid || req.query.uid;
	let paramPhoneNo = req.body.phoneNo || req.query.phoneNo;
	let paramClassify = req.body.classify || req.query.classify;
	let paramDateTime = req.body.DateTime || req.query.DateTime;
	console.log(`uid: ${paramUid} pno: ${paramPhoneNo} classify: ${paramClassify} datetime: ${paramDateTime}`);
	res.write('Logging page\n');
	res.write(`uid: ${paramUid}\n`);
	res.write(`pno: ${paramPhoneNo}\n`);
	res.write(`classify: ${paramClassify}\n`);
	res.write(`datetime: ${paramDateTime}\n`);
	if(database) {
		if (database) {
		      logger(database,paramUid,paramPhoneNo,paramClassify,paramDateTime,function(err,log){
		         if (err) {
		             console.error('error on logging : ' + err.stack);
		             return;
		         }
		         // 결과 객체 있으면 성공 응답 전송
		         if (log) {
		            //console.dir(log);
		            console.log('Success');
		         } else {  // 결과 객체가 없으면 실패 응답 전송
		            console.log('Failure: no res object');
		         }
		      });
		   } else { // DB 초기화 안 된 경우
		      console.log('DB is not initialized');
		   }
	}
	res.end();
});

function logger(database, uid, phoneNo, classify, DateTime, callback){
	console.log('logger 호출됨 : ' + uid + ', ' + phoneNo + ', ' + classify + ', ' + DateTime);
	var logInfo = new Model({"uid":uid, "phoneNo":phoneNo, "classify":classify, "DateTime":DateTime});
	logInfo.save(function(err) {
	      if (err) {
	    	 callback(err, null);
	         return;
	      }
	       console.log("Log data added");
	       callback(null, logInfo);
	   });
}

//스키마 및 모델 객체 생성
function createSchema() {
	// 스키마 정의
	   Schema = mongoose.Schema({
	       uid: {type: String, required: true, 'default':''},
	       phoneNo: {type: String, required: true, 'default':''},
	       classify: {type: Number},
	       DateTime: {type: Date, index: {unique:false}, 'default': Date.now} 
	   });
	   var d = new Date();
	   var month = d.getMonth()+1;
	   if(month<10) month = '0' + month;
	   Schema.set('collection','c1log'+d.getFullYear() + month);   
	   // 스키마에 static으로 findById 메소드 추가
	   
	   Schema.static('findById', function(uid, callback) {
	      return this.find({uid:uid}, callback);
	   });
	   
	    // 스키마에 static으로 findAll 메소드 추가
	   Schema.static('findAll', function(callback) {
	      return this.find({}, callback);
	   });
	   Schema.static('findByMonth',function(month,callback) {
	      let date = new Date();
	      let Year = date.getFullYear();
	      let re = new RegExp(Year,"ig");
	      //this.find({DateTime:/Year/});
	      return this.find({},callback);
	   });
	   
	   console.log('Schema defined');
	   // User 모델 정의
	   Model = mongoose.model(Schema.get('collection'), Schema);
	   console.log(Schema.get('collection')+' defined');   
}



module.exports = route;