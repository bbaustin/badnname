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



var server = app.listen(3001, function() {
	console.log('server running at http://localhost:3001')
});
