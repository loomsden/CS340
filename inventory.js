module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	
	function getInventory(res, db, context, complete){
		db.pool.query("SELECT * FROM Inventory;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.inventory = results;
			complete();
		});
	}
	
	function listHunters(res, db, context, complete){
		db.pool.query("SELECT hunterID, fName FROM Hunters ORDER BY hunterID ASC;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.hunters = results;
			complete();
		});
	}
	
	function listSupplies(res, db, context, complete){
		db.pool.query("SELECT supplyID, sName FROM Supplies ORDER BY supplyID ASC;", function(error, results, fields){
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
		
		getInventory(res, db, context, complete);
		listHunters(res, db, context, complete);
		listSupplies(res, db, context, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 3)
			{
				res.render('inventory', context);
				//res.send(JSON.stringify(context));
			}
		}
	});

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Inventory (hunterID, supplyID, quantity) VALUES (?,?,?)";
        var inserts = [req.body.hunterID, req.body.supplyID, req.body.quantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/inventory');
            }
        });
    });

	return router;
}();