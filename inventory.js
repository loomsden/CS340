module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	
	function getInventory(res, db, context, complete){
		db.pool.query("SELECT i.hunterID, i.supplyID, i.quantity, h.fName, s.sName FROM Inventory i JOIN Hunters h ON i.hunterID=h.hunterID JOIN Supplies s ON i.supplyID=s.supplyID ORDER BY i.hunterID ASC;", function(error, results, fields){
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
	
	
	function getHunter(res, db, context, hid, complete){
		var sql = "SELECT fName FROM Hunters WHERE hunterID = ?;";
		var inserts = [hid];
		db.pool.query(sql, inserts, function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.hunter = results[0];
			complete();
		});
	}
	
	function getSupply(res, db, context, sid, complete){
		var sql = "SELECT sName FROM Supplies WHERE supplyID = ?;";
		var inserts = [sid];
		db.pool.query(sql, inserts, function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.supply = results[0];
			complete();
		});
	}
	
	
	
	
	
	
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteinventory.js"];
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
		if(req.body.quantity <= 0)
			req.body.quantity = null;
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
	
	router.get('/:hid/supply/:sid', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["updateinventory.js"];
		var db = req.app.get('mysql');
		
		getInventory(res, db, context, complete);
		getHunter(res, db, context, req.params.hid, complete);
		getSupply(res, db, context, req.params.sid, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 3)
			{
				res.render('update-Inventory', context);
				//res.send(JSON.stringify(context));
			}
		}
	});
	
	router.put('/:hid/supply/:sid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Inventory SET quantity=? WHERE hunterID=? AND supplyID=?";
		if(req.body.quantity <= 0)
			req.body.quantity = null;
        var inserts = [req.body.quantity, req.params.hid, req.params.sid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
				res.end();
            }
        });
    });
	
	router.delete('/:hid/supply/:sid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Inventory WHERE hunterID=? AND supplyID=?";
        var inserts = [req.params.hid, req.params.sid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
				res.status(400);
                res.end();
            }else{
                res.status(200);
				res.end();
            }
        });
    });

	return router;
}();