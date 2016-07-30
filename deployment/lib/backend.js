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
	
	var app        = express();
	var router     = express.Router();
	var pageRouter = express.Router();
	
/* ----------------------------------------------------------------
 * $routes
 * ---------------------------------------------------------------- */
 	pageRouter.get('/', function(req, res) {

 	});
	pageRouter.get('/:page', function(req, res) {

	});

	router.use('/pages', pageRouter);


	router.get('/', function(req, res) {
		res.render('index');
	});
	
	router.get('/app', function(req, res) {
		res.render('app');
	});
	
	router.get('/about', function(req, res) {
		res.render('about');
	});

	router.get('/holoverse', function(req, res) {
		res.render('holoverse');
	});

	router.use(express.static(__dirname + '/../public'));

	module.exports = router;
	
})();