var dotenv     = require('dotenv').config({silent:true}),
    express    = require('express'),
    app        = express(),
    exphbs     = require('express-handlebars'),
    bodyParser = require('body-parser'),
    session    = require('express-session');


// Configure Setting
app.engine('hbs', exphbs({
  defaultLayout: 'default',
	layoutsDir:  __dirname + '/views/layouts',
	partialsDir: __dirname + '/views/partials',
	extname:     '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  name: 'sessionclass',
  resave: false,
  saveUninitialized: false,
  secret: 'akdh;akhfgafihgadkfhgakfdlghhlshf'
}));


// Connect to Database
require('./db/db');


// Mount Middleware
app.use(express.static(__dirname + '/public'));

app.use('/', require('./controllers/home'));
app.use('/', function(req, res, next) {
  if (req.session.isLoggedIn === true) {
    return next();
  } 
  else {
    res.redirect('/');
  }
});
app.use('/search', require('./controllers/search'));


// Server listen
var server = app.listen(process.env.PORT || 8008, function() {   
	console.log('server running at ' + server.address().port);
});
