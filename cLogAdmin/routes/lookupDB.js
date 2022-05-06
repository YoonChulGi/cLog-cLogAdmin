var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
var Schema;
var Model;

route.get('/',function(req,res){
	console.log('/lookupDB 호출됨');
	var database = req.app.get('database');
	let paramYear = req.body.year1 || req.query.year1;
	let paramMonth = req.body.month1 || req.query.month1;
	let year = paramYear;
	let month = paramMonth;

	console.log('paramYear: '+paramYear);
	console.log('paramMonth: '+ paramMonth);
	let logarr = new Array();
	if(database) {
		Schema = req.app.get('OrderedSchema');
		Schema.set('collection','c1r' + paramYear + paramMonth);
		Model = mongoose.model(Schema.get('collection'),Schema);
		 
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
				//console.log('results: ');
				//console.dir(results);
				let logarr = new Array();
				for(let i=0;i<results.length;i++) {
					logarr[i] = {
							uid: results[i]._doc.uid,
							phoneNo: results[i]._doc.phoneNo,
							startTime: results[i]._doc.startTime,
							EndTime: results[i]._doc.EndTime,
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
				res.end();
			} // if(result)
		});
	}
});

	


module.exports = route;

