module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	
	function getRewards(res, db, context, complete){
		db.pool.query("SELECT * FROM Rewards;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.rewards = results;
			complete();
		});
	}
	
	
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deletereward.js"];
		var db = req.app.get('mysql');
		
		getRewards(res, db, context, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 1)
			{
				res.render('rewards', context);
				//res.send(JSON.stringify(context));
			}
		}
	});

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Rewards (rName, type, rarity) VALUES (?,?,?)";
		if(req.body.rName == "")
			req.body.rName = null;
		if(req.body.type == "")
			req.body.type = null;
		if(req.body.rarity == "")
			req.body.rarity = null;
        var inserts = [req.body.rName, req.body.type, req.body.rarity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/rewards');
            }
        });
    });
	
	router.delete('/:id', function(req, res){
        var db = req.app.get('mysql');
        var sql = "DELETE FROM Rewards WHERE rewardID = ?";
        var inserts = [req.params.id];
        sql = db.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
				res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        });
    });
	
	return router;
}();