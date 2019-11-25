const express 		= require('express');
const logger 	    = require('morgan');
const bodyParser 	= require('body-parser');
const pe         = require('parse-error');
const cors       = require('cors');

const routes = require('./routes')(express);

const app = express();

var proxy = require('http-proxy').createProxyServer({});
app.use('/alerts', (req, res, next) => {
	proxy.web(req, res, { target: 'http://alert:9999' }, next);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use(cors());

// API Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// LowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({
	cameras: [
		{
			id: 1,
			section: 1,
			type: 'entry',
			address: 'http://camera1:8080',
		},
		{
			id: 2,
			section: 1,
			type: 'exit',
			address: 'http://camera2:8080',
		}
	],
	sections: [
		{
			id: 1,
			description: 'Gate #1',
			address: 'http://section:8888'
		}
	],
}).write()

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});

const port = '1234';

//Listen to port
app.listen(port);
console.log("Listening to port: " + port);
