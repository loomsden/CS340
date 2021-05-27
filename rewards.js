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
	return router;
}();