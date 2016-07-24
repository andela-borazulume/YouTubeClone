var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    testdb = require('./config/testdb');

    require('dotenv').load();

    // route = require('./server/routes');

var port = process.env.PORT || 4000;
// var port = 4000;

/**
 * Connect to MongoDB
 */

testdb.dbconnect();

/**
 * Create Express Server
 */
var app = express();

/**
 * Express configuration
 */

//Force HTTPS on heroku

if(process.env.NODE_ENV === 'production') {
  app.enable("trust proxy");
  app.use(function(req, res, next) {
      if(req.secure) {
         next();
      } else {
	res.redirect('https://' + req.headers.host + req.url);
      }
});
}

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); // serving static files like images, css, and all

/**
 * Routes Configuration
 */

// route(app);

//configure any route to redirect to angular

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


/**
 * Start Express server
 */

app.listen(port, function() {
    console.log("Yourtube server Listeening on port", port);
});



