var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
let Schema;
let Model;
let OrderedSchema;
let OrderedModel;


route.get('/',function(req,res){
	console.log('/lookupSave 호출됨');
	var database = req.app.get('database');
	let paramYear = req.body.year1 || req.query.year1;
	let paramMonth = req.body.month1 || req.query.month1;
	let year = paramYear;
	let month = paramMonth;
	console.log('paramYear: '+paramYear);
	console.log('paramMonth: '+ paramMonth);
	let logarr = new Array();
	if(database) {
		Schema = req.app.get('Schema');
		Schema.set('collection','c1log' + paramYear + paramMonth);
		Model = mongoose.model(Schema.get('collection'),Schema);
		OrderedSchema = req.app.get('OrderedSchema');
		OrderedSchema.set('collection','c1r'+paramYear+paramMonth);
		OrderedModel = mongoose.model(OrderedSchema.get('collection'),OrderedSchema);
		
		Model.findAll(function(err,results){
			if(err) {
				console.error(`로그 리스트 조회 중 오류 발생 ${err.stack}`);
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>로그 리스트 조회 중 오류 발생</h2>');
				res.write(`<p>${err.stack}</p>`);
				res.end();
				return ;
			}
			if(results) {
				//console.dir(results);
				let j = 0;
				
				for(let i=0;i<results.length;i++) { // results의 정보들중 월 맞는걸 가져온다. 
					logarr[j] = results[i]._doc;
					j++;	
				} // for( 이 문장이 완료되면 5월의 raw데이터 모아온 배열 만들어 짐)
				
				// in out 판별 알고리즘
				let logarr2 = new Array();
				let x=0;
				for(let i=0;i<logarr.length;i++) {
					if(logarr[i].classify == "0") {
						for(let j=i+1;j<logarr.length;j++) {
							if(logarr[j].uid == logarr[i].uid && logarr[j].classify == "1") {
								logarr2[x] = {
										uid:logarr[i].uid,
										phoneNo:logarr[i].phoneNo,
										startTime:logarr[i].DateTime,
										EndTime:logarr[j].DateTime,
								}
								x++;
								break;
							}else if(logarr[j].uid == logarr[i].uid && logarr[j].classify == "0") {
								break;
							}
						}
					}
				}
				
				// 만들어진 데이터를 db에 insert
				OrderedSchema.set('collection','c1r' + paramYear + paramMonth );
				OrderedModel = mongoose.model(OrderedSchema.get('collection'), OrderedSchema);
				let flag = true;
				OrderedModel.findAll(function(err,results) {
					if(err) {
						console.log('err');
					}
					if(results) {
						console.log('logarr2:');
						console.dir(logarr2);
						if(results.length == 0) {
							console.log('empty object이므로 모두 다 채워 넣습니다. ');
							for(let i=0;i<logarr2.length;i++) {
								let orderedLogInfo = new OrderedModel({
									"uid":logarr2[i].uid , "phoneNo": logarr2[i].phoneNo  ,
									"startTime":logarr2[i].startTime  ,"EndTime": logarr2[i].EndTime });
								orderedLogInfo.save(function(err){
									if(err) {
										console.log('err to logarr2 save');
									}
									console.log('logarr2 db에 insert');
								});
							}
						} else { // 이미 값을 가지고 있다면 하나 하나 비교하여 없는 부분을 채워 넣습니다. 
							
							for(let i=0;i<logarr2.length;i++) {
								for (let j = 0;j<results.length;j++) {
									if(results[j]._doc.uid == logarr2[i].uid
											&&results[j]._doc.startTime.getTime() == logarr2[i].startTime.getTime() 
											&&results[j]._doc.EndTime.getTime() == logarr2[i].EndTime.getTime()) {
										flag = false;
										break;
									}
								}
								if(flag) { // flag가 true이면 같은 것이 없으므로 추가 
									//console.log('없는 것 추가');
									//console.log(flag);
									let orderedLogInfo = new OrderedModel({
										"uid":logarr2[i].uid , "phoneNo": logarr2[i].phoneNo  ,
										"startTime":logarr2[i].startTime  ,"EndTime": logarr2[i].EndTime });
									orderedLogInfo.save(function(err){
										if(err) {
											console.log('err to log save');
										}
										console.log('logarr2 db에 추가함');
									});	
								} else { // flag가 false이므로 같은 것이 있다는소리 .. 다시 초기값으로 true로 돌려주고 continue
									//console.log('같은 것 있으므로 continue');
									flag = true;
									continue;
								}
							}
							
						}
						
					}
				});
				
			} //if(results)
		}); // Model.findAll
		res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>저장 완료</h2>');
		res.end();
	}
});


module.exports = route;
