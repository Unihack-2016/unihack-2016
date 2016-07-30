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
	var helper    = require('./helper.js');
	var form      = require('./fields.js');
	var util      = require('util');
	
	var app        = express();
	var router     = express.Router();
	



/* ----------------------------------------------------------------
 * $routes
 * ---------------------------------------------------------------- */
	module.exports = function(app) {
		var handler = {
			post   : {},
			get    : {},
			delete : {}
		};


		/* ----------------------------------------------------------------
 		 * $handlers
 		 * ---------------------------------------------------------------- */
		/**
		 * Gets pages root page
		 */
		handler.get.pages = function(req, res) {
			var pageNumber = 1;
			if(req.query.page) {
				pageNumber = req.query.page;
			}
			db.Page.paginate({}, {page:pageNumber, limit:10},function(err, data) {
				var pagination = {
					total : data.total,
					limit : data.limit,
					page  : data.page,
					pages : data.pages
				};
				helper.render(res, 'wrapper.html', {
					pages : data.docs,
					pagination : pagination
				});
			});
		};

		/**
		 * Creates a new page
		 */
		handler.post.pages = function(req, res) {
			if(req.body.title) {
				var obj = {
					title       : req.body.title,
					metadata    : '',
					template    : '',
					dateCreated : new Date(),
					homepage    : false
				};
				var page = new db.Page(obj);
				page.save(function() {
					res.send(page);
				});
			} else {
				res.send(500);
			}
		};

		/**
		 * Finds and gets a single page
		 */
		handler.get.page = function(req, res) {
			var slug = req.params.page;
			db.Page.findById({_id : slug}, function(err, page) {

				if(err) throw err;

				if(page) {
					var template = [];
					if(page.template) {
						
						// Important to note that we're gonna clone dis, not reference
						template = helper.findTemplate(app.locals.templates.all, page.template);

						// Get the unmodified template and pass it to the front end in case they need it
						var rawTemplate = JSON.stringify(template);

						template = template.fields;

						//console.log(util.inspect(template, {showHidden: false, depth: null}));
						
						// Parse json into data and merge it with the template
						var metadata = page.metadata || '{}';
						metadata = JSON.parse(metadata);
						template = form.interpolateFields(template, metadata);
					}
					helper.render(res, 'wrapper.html', {
						fields : template,
						rawTemplate : rawTemplate,
						page : page,
						templates : app.locals.templates.all
					});
				} else {
					res.send(404);
				}
			});
		};

		/**
		 * Updates a single page
		 */
		handler.post.page = function(req, res) {
			var slug = req.params.page;
			var data = req.body;
			
			var fields = '';
			//console.log('-----');
			//console.log(util.inspect(data.fields, {showHidden: false, depth: null}));
			if(data.fields) {
				fields = JSON.stringify(data.fields[0]);
			}
			data.metadata = fields;
			if(!data.homepage) {
				data.homepage = false;
			}
			db.Page.update({}, {homepage: false}, {multi:true}, function(err, docs) {
				if(docs) {
					db.Page.findOneAndUpdate({_id : slug}, data, function(err, doc) {
						if(doc) {
							res.redirect('back');
						} else {
							res.send(300);
						}
					});
				} else {
					res.send(300);
				}
			});
		};

		/**
		 * Deletes a single page
		 */
		handler.delete.page = function(req, res) {
			var slug = req.params.page;
			db.Page.remove({slug: slug}, function(err) {
				res.redirect(app.locals.paths.backend + '/pages');
			});
			res.send(200);
		};


		/* ----------------------------------------------------------------
		 * $routes
 		 * ---------------------------------------------------------------- */
		router.route('/')
			.get(handler.get.pages)
			.post(handler.post.pages);

		router.route('/:page')
			.get(handler.get.page)
			.post(handler.post.page);

		return router;
	}
	
})();