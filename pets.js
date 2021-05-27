module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	
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
	
	
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var db = req.app.get('mysql');
		
		getPets(res, db, context, complete);
		listHunters(res, db, context, complete);
		
		function complete(){
			callbackCount++;
			if (callbackCount >= 2)
			{
				res.render('pets', context);
				//res.send(JSON.stringify(context));
			}
		}
	});
	
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Pets (hunterID, pName, species, color) VALUES (?,?,?,?)";
		if(req.body.pName == "")
			req.body.pName = null;
		if(req.body.species == "")
			req.body.species = null;
		if(req.body.color == "")
			req.body.color = null;
        var inserts = [req.body.hunterID, req.body.pName, req.body.species, req.body.color];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/pets');
            }
        });
    });

	return router;
}();