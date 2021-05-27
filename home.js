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
	
	function getPets(res, db, context, complete){
		db.pool.query("SELECT petID, hunterID, pName, species, IFNULL(color, '*NULL*') AS color_nn FROM Pets;", function(error, results, fields){
			if (error){
				res.write(JSON.stringify(error));
				res.end(); 
			}
			context.pets = results;
			complete();
		});
	}
	
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
		
		getHunts(res, db, context, complete);
		getHunters(res, db, context, complete);
		getPets(res, db, context, complete);
		getInventory(res, db, context, complete);
		getSupplies(res, db, context, complete);
		getRewards(res, db, context, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 6)
			{
				res.render('home', context);
				//res.send(JSON.stringify(context));
			}
		}
	});
	
	return router;
}();