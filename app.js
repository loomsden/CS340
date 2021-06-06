var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9999;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./db-connector');
var bodyParser = require('body-parser');
var path = require('path');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', PORT);
app.set('mysql', db);



app.use('/', require('./home.js'));

app.use('/hunts', require('./hunts.js'));

app.use('/hunters', require('./hunters.js'));

app.use('/pets', require('./pets.js'));

app.use('/inventory', require('./inventory.js'));

app.use('/supplies', require('./supplies.js'));

app.use('/rewards', require('./rewards.js'));


app.post('/searchReward', function(req, res){
  var callbackCount = 0;
  var context = {};
  context.jsscripts = ["deletereward.js"];
  var term = req.body.search;

  db.pool.query("SELECT * FROM Rewards WHERE rName LIKE '%" + term + "%' OR type LIKE '%" + term + "%' OR rarity LIKE '%" + term + "%' ORDER BY rewardID ASC;", function(error, results, fields){
    if (error){
      res.write(JSON.stringify(error));
      res.end(); 
    }
    context.rewards = results;
    complete();
  });

  function complete(){
    callbackCount++;
    if (callbackCount >= 1)
    {
      res.render('reward', context);
      //res.send(JSON.stringify(context));
    }
  }
});




app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
