module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	
	function getHunters(res, db, context, complete){
		db.pool.query("SELECT hunterID, huntID, fName, IFNULL(lName, '*NULL*') AS lName_nn, hunterRank, weapon FROM Hunters;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.hunters = results;
			complete();
		});
	}
	
	function listHunts(res, db, context, complete){
		db.pool.query("SELECT huntID, target FROM Hunts ORDER BY huntID ASC;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.hunts = results;
			complete();
		});
	}
	
	
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var db = req.app.get('mysql');
		
		getHunters(res, db, context, complete);
		listHunts(res, db, context, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 2)
			{
				res.render('hunters', context);
				//res.send(JSON.stringify(context));
			}
		}
	});
	
	// Allow INSERT
    router.post('/', function(req, res){
        var db = req.app.get('mysql');
        var sql = "INSERT INTO Hunters (huntID, fName, lName, hunterRank, weapon) VALUES (?,?,?,?,?)";
        var inserts = [req.body.huntID, req.body.fname, req.body.lname, req.body.hunterRank, req.body.weapon];
        sql = db.pool.query(sql, inserts, function(error, results, fields){
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/hunters');
            }
        });
    });

   
	return router;
}();