var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');

route.get('/',function(req,res){
	console.log('/orderedLookupSave 호출됨');
	var database = req.app.get('database');
	let paramYear = req.body.year2 || req.query.year2;
	let paramMonth = req.body.month2 || req.query.month2;
	let year = paramYear;
	let month = paramMonth;
	console.log('paramYear: ' + paramYear);
	console.log('paramMonth: ' + paramMonth);
	if(database) {
		OrderedSchema = req.app.get('OrderedSchema');

		OrderedSchema.set('collection','c1r' + paramYear + paramMonth );
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
				}//for
				OrderedSchema.set('collection','c1f'+paramYear+paramMonth);
				OrderedModel = mongoose.model(OrderedSchema.get('collection'),OrderedSchema);
				var col = database.collection(OrderedSchema.get('collection'));
				col.remove({},function(err){
					if(err) {
						console.log('err to remove old data');
						res.write('err to remove old data');
						res.end();
						return;
					}
					for(let i=0;i<logarr.length;i++) {
						let orderedLogInfo = new OrderedModel({
							"uid":logarr[i].uid , "phoneNo": logarr[i].phoneNo  ,
							"startTime":logarr[i].startTime  ,"EndTime": logarr[i].EndTime });
						orderedLogInfo.save(function(err){
							if(err) {
								console.log('err to orderedLog save');
							}
							
							console.log('logarr db에 추가함');
						});
					}
					res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>저장 완료</h2>');
					res.end();
				});
			}
		});
	}
});

module.exports = route;

