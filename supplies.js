module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	
	function getSupplies(res, db, context, complete){
		db.pool.query("SELECT supplyID, sName, type, IFNULL(effect, '*NULL*') AS effect_nn FROM Supplies;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.supplies = results;
			complete();
		});
	}
	
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var db = req.app.get('mysql');
		
		getSupplies(res, db, context, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 1)
			{
				res.render('supplies', context);
				//res.send(JSON.stringify(context));
			}
		}
	});

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Supplies (sName, type, effect) VALUES (?,?,?)";
        var inserts = [req.body.sName, req.body.type, req.body.effect];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/supplies');
            }
        });
    });
	
	return router;
}();