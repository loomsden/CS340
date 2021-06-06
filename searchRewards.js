module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	
	function searchRewards(res, db, context, term, complete){
		db.pool.query("SELECT * FROM Rewards WHERE rName LIKE '%" + term + "%' OR type LIKE '%" + term + "%' OR rarity LIKE '%" + term + "%' ORDER BY rewardID ASC;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				console.log(JSON.stringify(error));
				res.end(); 
			}
			context.rewards = results;
			complete();
		});
	}

	
	router.post('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deletereward.js"];
		var db = req.app.get('mysql');
		
		var term = req.body.search;
		context.search = term;
        
		searchRewards(res, db, context, term, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 1)
			{
				res.render('rewards', context);
				//res.send(JSON.stringify(context));
			}
		}
	});

	
	return router;
}();
