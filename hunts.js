module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	
	function getHunts(res, db, context, complete){
		db.pool.query("SELECT huntID, target, area, rank, outcome, IFNULL(rewardID, '*NULL*') AS rewardID_nn FROM Hunts;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.hunts = results;
			complete();
		});
	}
	
	function listRewards(res, db, context, complete){
		db.pool.query("SELECT rewardID, rName FROM Rewards ORDER BY rewardID ASC;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.rewards = results;
			complete();
		});
	}
	
	// Display page
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var db = req.app.get('mysql');
		
		getHunts(res, db, context, complete);
		listRewards(res, db, context, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 2)
			{
				res.render('hunts', context);
				//res.send(JSON.stringify(context));
			}
		}
	});
	
	// Allow INSERT
	router.post('/', function(req, res){
		var db = req.app.get('mysql');
		var sql = "INSERT INTO Hunts (target, area, rank, outcome, rewardID) VALUES (?,?,?,?,?);";
		var inserts = [req.body.target, req.body.area, req.body.rank, req.body.outcome, req.body.reward];
		sql = db.pool.query(sql, inserts, function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}else{
				res.redirect('/hunts');
			}
		});
	});
		
	
	return router;
}();