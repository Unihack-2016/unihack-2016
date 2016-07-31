/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * frontend.js
 * 
 * Contains all frontend routes
 * ---------------------------------------------------------------- */


(function() {

	'use strict';
	
	var express   = require('express');
	var _         = require('underscore');
	var appConfig = require('../config.js');
	var db        = require('./db.js');
	var helper    = require('./helper.js');
	var globals   = require('./globals.js');

	var router    = express.Router();


	/**
	 * Serves page
	 * @param  {Object} req  [express response object]
	 * @param  {Object} res  [Page object]
	 * @param  {Object} page [express request object]
	 */
	function servePage(req, res, page, homepage) {

		if(homepage && req.isAuthenticated() && req.user.facebook_id) {
			res.locals.user = req.user;
		}

		if(page) {
			res.locals.fields = '';
			if(page.metadata) {
				res.locals.fields = JSON.parse(page.metadata);
			}
			var contentType = req.headers['content-type'] || '';

			// Fetches options and sets them as globals
			var options = req.app.locals.templates.optionsCache || '{}';
			options = JSON.parse(options);
			res.locals.globals = options;
			res.locals.page = {
				dateCreated : page.dateCreated,
				dateModified : page.dateModified,
				id : page._id
			};

			// Sets requests
			var template = helper.findTemplate(req.app.locals.templates.all, page.template);
			console.log(template.requests);

			// Send json if requested
			if(contentType === 'application/json' || contentType.indexOf('application/json') === 0) {
				res.type('json').status(200).json(res.locals);
			} else {
				if(!page.template) {
					page.template = 'index';
				}
				res.render(page.template);
			}
		} else {
			res.end(); // Setup a 404 handler here
		}
	}


	function setPaths(req, res, next) {
		var fullUrl = req.protocol + '://' + req.get('host');
		res.locals.paths = res.locals.paths || {};
		res.locals.paths.siteUrl = fullUrl;
		console.log(res.locals);
		next();
	}

	function loadGoals(cb) {
		db.goal.find({}, function(err, goals) {
			if(err) {
				throw err;
			}
			cb(goals);
		});
	}


/* ----------------------------------------------------------------
 * $routes
 * ---------------------------------------------------------------- */
	module.exports = function(app) {

		router.use(setPaths);

		/**
		 * Handles home page requests
		 */
		router.route('/')
			.get(function(req, res) {
				db.Page.findOne({
					homepage : true
				}, function(err, page) {
					if(err) throw err;
					loadGoals(function(goals) {
						res.locals.goals = goals;
						servePage(req, res, page, true);
					});
				});
			});

		/**
		 * Handles different page requests.
		 * If a page is not found, the request is passed along.
		 */
		router.get('/:item', function(req, res, next) {
			var slug = req.params.item;
			db.Page.findOne({
				slug : slug
			}, function(err, page) {
				if(page) {
					servePage(req, res, page);
				} else {
					next(); // It may be a content type
				}
			});
		});

		/**
		 * Handles Content types
		 */
		router.get('/:type', function(req, res) {
			var slug = req.params.type;
			res.send('huh?');
		});

		/**
		 * Sets up static assets
		 */
		var path = app.locals.paths.deploymentDir + '/public';
		router.use(express.static(path));

		return router;
	}
	
})();