// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

//Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

//에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
 
// mongoose 모듈 사용
var mongoose = require('mongoose');

//익스프레스 객체 생성
var app = express();

var c1log = require('./routes/c1log');

//기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/', static(path.join(__dirname, '/')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
   secret:'my key',
   resave:true,
   saveUninitialized:true
}));

var router = express.Router();

var c1logRouter = require('./routes/c1log');


app.use('/',router);
app.use('/logger',c1logRouter);

app.use(errorHandler);

process.on('SIGTERM',function(){
	console.log('Process is terminated.');
	app.close();
});

app.on('close',function(){
	console.log('express server object is terminated.');
});

http.createServer(app).listen(app.get('port'),function(){
	console.log('Server is started on port:' + app.get('port'));
});
module.exports = app;
