var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');

route.post('/',function(req,res){
	console.log('/countbydatetime 호출됨');
	var database = req.app.get('database');
	let paramYear = req.body.year3 || req.query.year3;
	let paramMonth = req.body.month3 || req.query.month3;
	if(paramMonth<10) {
		paramMonth = '0' + paramMonth;
	}
	console.log('paramYear: ' + paramYear);
	console.log('paramMonth: '+ paramMonth);
	if(database) {
		OrderedSchema = req.app.get('OrderedSchema');

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
				//console.dir(results);
				let logarr = new Array();
				
				for(let i=0;i<results.length;i++) {
					logarr[i] = results[i]._doc;
				}
				let dtArray = new Array(2880);
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
				
				let context = {month:paramMonth, dtArray : dtArray};
				req.app.render('count_d_t',context, function(err,html){
					if(err) {
						console.log(`뷰 렌더링 중 오류 발생: ${err.stack}`);
						res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
						res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
						res.write(`<p>${err.stack}</p>`);
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

