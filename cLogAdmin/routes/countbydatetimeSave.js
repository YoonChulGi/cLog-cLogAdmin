var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');

route.get('/',function(req,res){
	console.log('/countbydatetimeSave 호출됨');
	var database = req.app.get('database');
	let paramYear = req.body.year3 || req.query.year3;
	let paramMonth = req.body.month3 || req.query.month3;

	console.log('paramYear: ' + paramYear);
	console.log('paramMonth: '+ paramMonth);
	if(database) {
		let dtArray = new Array(2880);
		OrderedSchema.set('collection','c1f' + paramYear + paramMonth );
		console.log(OrderedSchema.get('collection'));
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
				DTSchema = req.app.get('DTSchema');
				DTModel = req.app.get('DTModel');
				DTSchema.set('collection','c1' + paramYear + paramMonth );
				console.log(DTSchema.get('collection'));
				DTModel = mongoose.model(DTSchema.get('collection'), DTSchema);
				DTModel.remove({},function(err){
					if(err) {
						console.log('remove err');
						return;
					}
					console.log('remove success');
				});
				//console.dir(results);
				let logarr = new Array();
				
				for(let i=0;i<results.length;i++) {
					logarr[i] = results[i]._doc;
				}
				
				for(let i=0;i<2880;i++) {
					dtArray[i] = new Array(31);
				}
				for(let i=0;i<2880;i++) {
					for(let j=0;j<31;j++) {
						dtArray[i][j] = 0;
					}
				}
				for(let i=0; i<logarr.length; i++) {
					let tempStartSec = logarr[i].startTime.getSeconds() == 0 ? 0 : 1 ;
					let startRow = logarr[i].startTime.getHours()*120 + logarr[i].startTime.getMinutes()*2 + tempStartSec;
					console.log('startRow: '+ startRow);
					let tempEndSec = logarr[i].EndTime.getSeconds() == 0 ? 0 : 1;
					let endRow = logarr[i].EndTime.getHours()*120 + logarr[i].EndTime.getMinutes()*2 + tempEndSec;
					console.log('endRow:' + endRow);
					let startDay = logarr[i].startTime.getDate()-1;
					let endDay = logarr[i].EndTime.getDate()-1;
					console.log(`startDay: ${startDay}, endDay: ${endDay}`);
					
					if(endRow > startRow) {
						for(let i = startRow; i< endRow; i++) {
							console.log(`dtArray[${i}][${startDay}] 하나 증가함`);
							dtArray[i][startDay]++; 
							console.log(`dtArray[${i}][${startDay}] : ${dtArray[i][startDay]}`);
						}
					}
				}
				let d = new Date();
				d.setHours(0);d.setMinutes(0);d.setSeconds(0);
				for(let i=0;i<2880;i++){
					
					modelDT = new DTModel({
						"TimeDate":d.getHours()+':' + d.getMinutes() + ':' + d.getSeconds(), 
						"d1": dtArray[i][0],
						"d2": dtArray[i][1],
						"d3": dtArray[i][2],
						"d4": dtArray[i][3],
						"d5": dtArray[i][4],
						"d6": dtArray[i][5],
						"d7": dtArray[i][6],
						"d8": dtArray[i][7],
						"d9": dtArray[i][8],
						"d10": dtArray[i][9],
						"d11": dtArray[i][10],
						"d12": dtArray[i][11],
						"d13": dtArray[i][12],
						"d14": dtArray[i][13],
						"d15": dtArray[i][14],
						"d16": dtArray[i][15],
						"d17": dtArray[i][16],
						"d18": dtArray[i][17],
						"d19": dtArray[i][18],
						"d20": dtArray[i][19],
						"d21": dtArray[i][20],
						"d22": dtArray[i][21],
						"d23": dtArray[i][22],
						"d24": dtArray[i][23],
						"d25": dtArray[i][24],
						"d26": dtArray[i][25],
						"d27": dtArray[i][26],
						"d28": dtArray[i][27],
						"d29": dtArray[i][28],
						"d30": dtArray[i][29],
						"d31": dtArray[i][30],
					});
					console.log('row:' + i);
					d.setMilliseconds(d.getMilliseconds()+ 30000);
					console.log(d.getHours()+':' + d.getMinutes() + ':' + d.getSeconds());

					modelDT.save(function(err){
						if(err) {
							console.log('err to save result');
							return;
						}
					});
				}
			}
		});
	}
	res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
	res.write('<h2>저장 완료</h2>');
	res.end();
});

module.exports = route;

