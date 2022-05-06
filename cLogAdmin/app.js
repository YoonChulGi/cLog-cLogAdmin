// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');
var router = express.Router();
// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
 
// mongoose 모듈 사용
var mongoose = require('mongoose');

// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/', static(path.join(__dirname, '/')));



app.set('views',__dirname+'/views');
app.set('view engine','ejs');
console.log('View engine is set to ejs.');
console.log(app.get("view engine"));
//===== 데이터베이스 연결 =====//

// 데이터베이스 객체를 위한 변수 선언
let database;

// ordered table을 위한 모델 객체를 위한 변수 선언
let OrderedModel;
let OrderedSchema;
//데이터베이스에 연결
function connectDB() {
	// 데이터베이스 연결 정보
	var databaseUrl = 'mongodb://localhost:27017/local';
	 
	// 데이터베이스 연결
    console.log('Try to connect to database.');
    mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
	mongoose.connect(databaseUrl);
	database = mongoose.connection;
	
	database.on('error', console.error.bind(console, 'mongoose connection error.'));	
	database.on('open', function() {
		console.log('DB is connected. : ' + databaseUrl);
		// user 스키마 및 모델 객체 생성
		app.set('database',database);
		
		createUserSchema();		
	});
	
    // 연결 끊어졌을 때 5초 후 재연결
	database.on('disconnected', function() {
        console.log('DB is disconnected. Reconnect after 5-sec.');
        setInterval(connectDB, 5000);
    });
}


// user 스키마 및 모델 객체 생성
function createUserSchema() {
	// DTSchema 정의 
	DTSchema = mongoose.Schema({
		TimeDate:{type:String, 'default':''},
		d1: {type: String, 'default':'0'},
		d2: {type: String, 'default':'0'},
		d3: {type: String, 'default':'0'},
		d4: {type: String, 'default':'0'},
		d5: {type: String, 'default':'0'},
		d6: {type: String, 'default':'0'},
		d7: {type: String, 'default':'0'},
		d8: {type: String, 'default':'0'},
		d9: {type: String, 'default':'0'},
		d10: {type: String, 'default':'0'},
		d11: {type: String, 'default':'0'},
		d12: {type: String, 'default':'0'},
		d13: {type: String, 'default':'0'},
		d14: {type: String, 'default':'0'},
		d15: {type: String, 'default':'0'},
		d16: {type: String, 'default':'0'},
		d17: {type: String, 'default':'0'},
		d18: {type: String, 'default':'0'},
		d19: {type: String, 'default':'0'},
		d20: {type: String, 'default':'0'},
		d21: {type: String, 'default':'0'},
		d22: {type: String, 'default':'0'},
		d23: {type: String, 'default':'0'},
		d24: {type: String, 'default':'0'},
		d25: {type: String, 'default':'0'},
		d26: {type: String, 'default':'0'},
		d27: {type: String, 'default':'0'},
		d28: {type: String, 'default':'0'},
		d29: {type: String, 'default':'0'},
		d30: {type: String, 'default':'0'},
		d31: {type: String, 'default':'0'}
	});
	DTSchema.set('collection','timedatetable' + (new Date().getMonth()+1) );
	DTSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	console.log(DTSchema.get('collection'));
	DTModel = mongoose.model(DTSchema.get('collection'), DTSchema);
	console.log('DTSchema 정의함.');
	
	
	// orderedmodel 스키마 정의
	OrderedSchema = mongoose.Schema({
		uid: {type: String, required: true, 'default':''},
		phoneNo: {type: String, required: true, 'default':''},
		startTime: {type: Date, required: true, index: {unique:false} },
		EndTime: {type: Date, required: true, index: {unique:false} }
	});
	OrderedSchema.set('collection','testordered' + (new Date().getMonth()+1) );
	OrderedSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	console.log(OrderedSchema.get('collection'));
	OrderedModel = mongoose.model(OrderedSchema.get('collection'), OrderedSchema);
	console.log('OrderedSchema 정의함.');
	
	
	// 스키마 정의
	UserSchema = mongoose.Schema({
	    uid: {type: String, required: true, 'default':''},
	    phoneNo: {type: String, required: true, 'default':''},
	    classify: {type: Number},
	    DateTime: {type: Date, index: {unique:false}, 'default': Date.now} 
	});
	UserSchema.set('collection','test');   
	
    // 스키마에 static으로 findAll 메소드 추가
	UserSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	
	console.log('UserSchema 정의함.');
	// User 모델 정의
	UserModel = mongoose.model("test", UserSchema);
	console.log('test 정의함.');	
	app.set('Schema',UserSchema);
	app.set('Model',UserModel);
	app.set('OrderedSchema',OrderedSchema);
	app.set('OrderedModel',OrderedModel);
	app.set('DTSchema',DTSchema);
	app.set('DTModel',DTModel);
}

//===== 라우팅 함수 등록 =====//

// 라우터 객체 참조
var lookupRouter = require('./routes/lookup');
var lookupSaveRouter = require('./routes/lookupSave');
var lookupDBRouter = require('./routes/lookupDB');
var orderedLookupRouter = require('./routes/orderedLookup');
var orderedLookupSaveRouter = require('./routes/orderedLookupSave');
var orderedLookupDBRouter = require('./routes/orderedLookupDB');
var countbydatetimeRouter = require('./routes/countbydatetime');
var countbydatetimeSaveRouter = require('./routes/countbydatetimeSave');
var countbydatetimeDBRouter = require('./routes/countbydatetimeDB');

app.use('/',router);
app.use('/lookup',lookupRouter);
app.use('/lookupSave',lookupSaveRouter);
app.use('/lookupDB',lookupDBRouter);
app.use('/orderedLookup',orderedLookupRouter);
app.use('/orderedLookupSave',orderedLookupSaveRouter);
app.use('/orderedLookupDB',orderedLookupDBRouter);
app.use('/countbydatetime',countbydatetimeRouter);
app.use('/countbydatetimeSave',countbydatetimeSaveRouter);
app.use('/countbydatetimeDB',countbydatetimeDBRouter);

app.use( errorHandler );

//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database) {
		database.close();
	}
});

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
  // 데이터베이스 연결을 위한 함수 호출
  connectDB();
});
