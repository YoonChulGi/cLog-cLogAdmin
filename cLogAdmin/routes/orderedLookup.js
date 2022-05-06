var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
var Schema;
var Model;

route.post('/',function(req,res){
	console.log('/orderedLookup 호출됨');
	var database = req.app.get('database');
	let paramYear = req.body.year2 || req.query.year2;
	let paramMonth = req.body.month2 || req.query.month2;
	let year = paramYear;
	let month = paramMonth;
	if(paramMonth<10) {
		paramMonth = '0' + paramMonth;
	}
	if(database) {
		OrderedSchema = req.app.get('OrderedSchema');

		OrderedSchema.set('collection','c1r' + paramYear +paramMonth );
		OrderedModel = mongoose.model(OrderedSchema.get('collection'), OrderedSchema);
		OrderedModel.findAll(function(err,results) {
			if(err) {
				console.error(`로그 리스트 조회 중 오류 발생 ${err.stack}`);
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>로그 리스트 조회 중 오류 발생</h2>');
				res.write(`<p>${err.stack}</p>`);
				res.end();
				return ;
			}
			if(results) {
				let logarr = new Array();
				
				for(let i=0;i<results.length;i++) {
					logarr[i] = results[i]._doc;
				}
				//console.dir(logarr);
				for(let i=0;i<logarr.length;i++) {
					if(!(logarr[i].startTime.getSeconds() == 0 || logarr[i].startTime.getSeconds()==30)){
						if(logarr[i].startTime.getSeconds() < 30) { // 시작시간이 30초보다 작거나 같다면 30초로
							logarr[i].startTime.setSeconds(30);
						} else{ // 30초 보다 크면 
							logarr[i].startTime.setSeconds(0);; // 초를 0초로 
							let m = logarr[i].startTime.getMinutes();
							m++;
							logarr[i].startTime.setMinutes(m); // 분을하나 증가
						}
					}
					if(!(logarr[i].EndTime.getSeconds()==0 || logarr[i].EndTime.getSeconds() == 30)) {
						if(logarr[i].EndTime.getSeconds() < 30) {
							logarr[i].EndTime.setSeconds(0);
						} else {
							logarr[i].EndTime.setSeconds(30);
						}
					}
				}
				let context = {year:paramYear,month:paramMonth, loglist : logarr};
				req.app.render('lookup_search1',context, function(err,html){
					if(err) {
						console.log('뷰 렌더링 중 오류 발생: '+err.stack);
						res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
						res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
						res.write('<p>'+err.stack+'</p>');
						res.end();
						return;
					}
					res.end(html);
				});
			}
		});
	}
});


module.exports = route;

