var express    = require('express');
var app        = express();
var exphbs     = require('express-handlebars');
var bodyParser = require('body-parser');


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


// Connect to Database
require('./db/db');


// Middleware
app.use(express.static(__dirname + '/public'));
app.use(require('./controllers/home'));
app.use('/signup', require('./controllers/signup'));
app.use('/search', require('./controllers/search'));



var server = app.listen(8008, function() {
	console.log('server running at ' + server.address().port)
});
