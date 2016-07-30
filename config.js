/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * config.js
 *
 * Contains middleware definitions.
 * Remember that the order of middleware is important especially regarding
 * passport and cookieSession middleware.
 * ---------------------------------------------------------------- */


(function() {

	'use strict';


	/* ----------------------------------------------------------------
	Dependencies
	---------------------------------------------------------------- */
	var bodyParser    = require('body-parser'); // Parses post requests
	var morgan        = require('morgan');
	var exphbs        = require('express-handlebars');
	var favicon       = require('serve-favicon');
	var cookieParser  = require('cookie-parser');
	var passport      = require('passport');
	var session       = require('express-session');
	var cookieSession = require('cookie-session');
	var moment        = require('moment');
	var nunjucks      = require('nunjucks');
	var flash         = require('express-flash');


	/* ----------------------------------------------------------------
	Middleware configuration
	---------------------------------------------------------------- */
	exports.setup = function(app, express) {

		/**
		 * Disables http header x-powered-by
		 */
		app.disable('x-powered-by');
		
		/**
		 * Will consider /app/ and /app to be the same
		 */
		app.set('strict routing', false);

		/**
		 * Sets express to the current.
		 * May be used to override with different values later on.
		 */
		app.set('env', process.env.NODE_ENV); // Remove for production

		//app.disable('view cache');
		
		/**
		 * No need for this right now. May be needed in the future
		 */
		app.set('views', './views');

		/**
		 * Sets jsonp callback name
		 */
		app.set('jsonp callback name', 'callback');

		/**
		 * Sets templating extension.
		 * html is recommended instead of njk mainly because ide's provide better support
		 * to .html files
		 */
		app.set('view engine', 'html');

		/**
		 * Sets cookie session
		 * @type {String}
		 */
		app.use(cookieSession({
			//key    : cookieKey,
			secret : 'cookieSecret',
			cookie : {
				maxAge: 900000
			}
		}));

		/**
		 * Sets up passport auth
		 */
		app.use(passport.initialize());
		app.use(passport.session());

		/**
		 * Sets up flash messaging
		 */
		app.use(flash());

		/**
		 * Sets up body parser and json parser.
		 */
		app.use(bodyParser.urlencoded({
			extended : true
		}));
		app.use(bodyParser.json());

		/**
		 * Sets up cookie cookie-parser.
		 * May be needed in the future
		 */
		app.use(cookieParser());

		/**
		 * Sets up favicon
		 */
		app.use(favicon(__dirname + '/public/img/favicon.ico'));

		/**
		 * Logs express app
		 */
		if(app.get('env') !== 'server') {
			app.use(morgan('dev')); // Remove for production
		}

		/**
		 * Configure client side templates
		 */
		nunjucks.configure(app.locals.paths.deploymentDir + '/templates', {
			autoescape: true,
			express: app
		});

	};

})();
