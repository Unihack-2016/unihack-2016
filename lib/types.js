/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * types.js
 *
 * Handles and serves custom Content Types
 * ---------------------------------------------------------------- */


(function() {

	'use strict';
	
	var express   = require('express');
	var _         = require('underscore');
	var appConfig = require('../config.js');
	var db        = require('./db.js');
	var helper    = require('./helper.js');
	
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

		/**
		 * Middle to check if a type exists
		 */
		function checkTypes(req, res, next) {
			var types = app.locals.types || [];
			var slug = '/' + req.params.type;
			var success = false;

			types.map(function(obj) {
				if(obj.slug === slug) {
					success = true;
					res.locals.typeNamePlural = obj.plural;
					res.locals.typeName       = obj.name;
					res.locals.typeFields     = obj.typeFields;
				}
			});

			if(success) {
				next();
			} else {
				res.send(404);
			}
		}


		/* ----------------------------------------------------------------
 		 * $handlers
 		 * ---------------------------------------------------------------- */
		/**
		 * Gets pages root page
		 */
		handler.get.pages = function(req, res) {
			var type = res.locals.typeName;

			// Manual override
			res.locals.pageName = 'types';
			var pageNumber = 1;
			if(req.query.page) {
				pageNumber = req.query.page;
			}
			db[type].paginate({}, {page:pageNumber, limit:10},function(err, data) {
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
			var data = req.body;
			var typeName = res.locals.typeName;
			if(data.fields) {
				data = data.fields[0];
				var obj =  new db[typeName](data);
				obj.save(function() {
					res.send(obj);
				});
			} else {
				res.send(500);
			}
		};

		/**
		 * Finds and gets a single page
		 */
		handler.get.page = function(req, res) {
			var type = res.locals.typeName;
			var slug = req.params.id;
			console.log(req.params);
			db[type].findById({_id : slug}, function(err, page) {

				if(err) throw err;

				if(page) {
					var template = {};
					if(page.template) {
						template = helper.findTemplate(app.locals.templates.all, page.template);
						template = template.fields;
						template = helper.interpolateTemplateData(template, page.metadata);
					}
					console.log(page);
					res.locals.pageName = 'type';
					helper.render(res, 'wrapper.html', {
						fields : template,
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
		router.route('/:type')
			.all(checkTypes)
			.get(handler.get.pages)
			.post(handler.post.pages)

		router.route('/:type/:id')
			.all(checkTypes)
			.get(handler.get.page)
			//.post(handler.post.page);

		return router;
	}
	
})();