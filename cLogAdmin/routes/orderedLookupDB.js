var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');

route.get('/',function(req,res){
	console.log('/orderedLookupDB 호출됨');
	var database = req.app.get('database');
	let paramYear = req.body.year2 || req.query.year2;
	let paramMonth = req.body.month2 || req.query.month2;
	console.log('paramYear: ' + paramYear);
	console.log('paramMonth: ' + paramMonth);
	OrderedSchema = req.app.get('OrderedSchema');
	OrderedSchema.set('collection','c1f'+paramYear+paramMonth);
	OrderedModel = mongoose.model(OrderedSchema.get('collection'),OrderedSchema);
	OrderedModel.findAll(function(err,results){
		if(err) {
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>에러</h2>');
			res.end();
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
		}
	});
});

module.exports = route;

