var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');

route.get('/',function(req,res){
	console.log('/countbydatetimeDB 호출됨');
	var database = req.app.get('database');
	let paramYear = req.body.year3 || req.query.year3;
	let paramMonth = req.body.month3 || req.query.month3;
	console.log('paramYear: ' + paramYear);
	console.log('paramMonth: '+ paramMonth);
	if(database) {
		DTSchema = req.app.get('DTSchema');
		DTModel = req.app.get('DTModel');
		DTSchema.set('collection','c1'+paramYear+paramMonth);
		DTModel = mongoose.model(DTSchema.get('collection'),DTSchema);
		DTModel.findAll(function(err,results){
			if(err) {
				console.log('err');
				return ;
			}
			if(results) {
				let logarr = new Array();
				
				for(let i=0;i<results.length;i++) {
					logarr[i] = results[i]._doc;
				}
				
				let context = {year:paramYear,month:paramMonth,logarr:logarr};
				req.app.render('count_d_tDB',context, function(err,html){
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
	}
});

module.exports = route;

