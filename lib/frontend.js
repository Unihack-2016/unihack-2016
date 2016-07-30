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
	function servePage(req, res, page) {

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


/* ----------------------------------------------------------------
 * $routes
 * ---------------------------------------------------------------- */
	module.exports = function(app) {

		/**
		 * Handles home page requests
		 */
		router.route('/')
			.get(function(req, res) {
				db.Page.findOne({
					homepage : true
				}, function(err, page) {
					if(err) throw err;
					servePage(req, res, page);
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