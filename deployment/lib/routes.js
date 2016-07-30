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
	
	var app = express();
	
	var globals = appConfig.vars;
	appConfig.setup(app, express);
	
	var regex = new RegExp("(((http:\/\/www)|(https:\/\/www)|(http:\/\/)|(https:\/\/)|(www))[-a-zA-Z0-9@:%_\+.~#?&//=]+)\.(jpg|jpeg|gif|png|bmp|tiff|tga|svg)");
	
	function parseUrl(url) {
		if(regex.test(url)) {
			return true;
		} else {
			return false;
		}
	}
	
	
	app.use(function (req, res, next) {
		var result = parseUrl(req.url);
		if(result) {
			res.render('app',{
				imageUrl : req.url.substr(1)
			});
		} else {
			next();
		}
	});
	
	
/* ----------------------------------------------------------------
 * $routes
 * ---------------------------------------------------------------- */
	// GET requests
	app.get('/', function(req, res) {
		res.render('index');
	});
	
	app.get('/app', function(req, res) {
		res.render('app');
	});
	
	app.get('/about', function(req, res) {
		res.render('about');
	});

	app.get('/holoverse', function(req, res) {
		res.render('holoverse');
	});

	app.use('/backend', backend);
	

	
	app.use(express.static(__dirname + '/../public'));
	console.log(__dirname);
	
	// Starts the express app
	app.listen(globals.port, globals.host);
	
})();