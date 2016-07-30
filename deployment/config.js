/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * app-config.js
 *
 * Contains config options relevant only to express
 * ---------------------------------------------------------------- */


(function() {

	'use strict';


	/* ----------------------------------------------------------------
	Dependencies
	---------------------------------------------------------------- */
	var bodyParser   = require('body-parser'); // Parses post requests
	var morgan       = require('morgan');
	var exphbs       = require('express-handlebars');
	var favicon      = require('serve-favicon');
	var cookieParser = require('cookie-parser');
	var YAML         = require('yamljs');
	var fs           = require('fs');

	fs.readFile('./config.yaml', "utf8", function(err, data) {
		var obj = YAML.parse(data);
		console.log(obj);
	});

	/* ----------------------------------------------------------------
	Express configuration
	---------------------------------------------------------------- */
	exports.setup = function(app, express) {
		app.disable('x-powered-by');
		app.disable('view cache'); // Remove for production
		app.set('env', 'development'); // Remove for production
		app.set('views', './views');
		app.set('jsonp callback name', 'callback');
		app.engine('html', exphbs.create({
			helpers : {
				select : function(selected, options) {
					return options.fn(this).replace(
					new RegExp(' value=\"' + selected + '\"'),
					'$& selected="selected"');
				}
			}
		}).engine);
		app.set('view engine', 'html');
		/*app.use(cookieParser());
		app.use(session({
			key    : config.cookieName,
			secret : config.cookeSecret,
			cookie : {
				maxAge : 1920000
			}
		}));*/ // No need for this right now.
		app.use(bodyParser({
			limit : '8mb'
		}));
		app.use(cookieParser());
		app.use(favicon(__dirname + '/public/img/favicon.ico'));
		app.use(morgan('dev')); // Remove for production
	};


	/* ----------------------------------------------------------------
	Global variables
	---------------------------------------------------------------- */
	exports.vars = {

		host     : process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
		port     : process.env.OPENSHIFT_NODEJS_PORT || 80,

		mongoConnectionString : function() {

			var str = '';

			if(process.env.MONGODB_URL) {
				str = process.env.MONGODB_URL + 'test';
				/*str = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
					process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
					process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
					process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
					process.env.OPENSHIFT_APP_NAME;*/
			} else {
				str = '127.0.0.1:27017/test';
			}

			return str;
		}

	};

})();
