/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * routes.js
 * 
 * Contains all routes
 * ---------------------------------------------------------------- */


(function() {

	'use strict';
	
	var express   = require('express');
	var _         = require('underscore');
	var appConfig = require('../config.js');
	var db        = require('./db.js');
	var backend   = require('./backend.js');
	var helper    = require('./helper.js');
	var fs        = require('fs');
	var async     = require('async');
	var globals   = require('./globals.js');
	var form      = require('./fields.js');

	var frontend = require('./frontend.js');
	var backend  = require('./backend.js');

	var app = express();

	
/* ----------------------------------------------------------------
 * $options
 * ---------------------------------------------------------------- */


/* ----------------------------------------------------------------
 * $app
 * ---------------------------------------------------------------- */
	function App(vars) {
		parseOptions(vars);
	}

	App.prototype.start = function() {
		initializeRoutes();
	}


	function initializeRoutes() {

		appConfig.setup(app, express);

		app.use(frontend(app));
		app.listen(app.locals.server.port, app.locals.server.host);
	}


	module.exports = App;
	
})();