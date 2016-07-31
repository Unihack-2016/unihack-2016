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
	var passport = require('passport');
	var db       = require('./db.js');
	var mongoose = require('mongoose');
	var moment = require('moment-timezone');
	moment().tz("Australia/Melbourne").format();

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



		require('./passport.js')(passport, app);

		// -------- Backend handler -------- //
		var handler = {
			get : {},
			post : {}
		};


		// -------- Backend routes -------- //
    router.get('/auth/facebook', passport.authenticate('facebook-login', { scope : ['email'] }));

    router.get('/auth/facebook/callback',
    passport.authenticate('facebook-login', {
        successRedirect : '/',
        failureRedirect : '/'
    }));

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/profile/:id', function(req, res) {

    	if(homepage && req.isAuthenticated() && req.user.facebook_id) {
				res.locals.user = req.user;
			}
    	var slug = req.params.id;

    	if(!mongoose.Types.ObjectId.isValid(slug)) {
    		res.send(401);
    	} else {

				db.end_user.findById(slug, function(err, user) {
					if(err) {
						throw err;
					}

					// var goals = [
					// 	{
					// 		title : 'zz',
					// 		description : 'abc',
					// 		date_created : 'asd',
					// 		date_completed : 'asd',
					// 		status: 1,
					// 		boolean: true,
					// 		comments : []
					// 	}
					// ];
					var goals = [
						{
							title : 'zz',
							description : 'abc',
							time_created : 'zxyas'
						}
					];

					if(user) {
						res.locals.user = user;
						res.locals.goals = goals;
						res.render('profile');
					} else {
						res.send(404);
					}

				});
			}
    });

    router.post('/profile/:id', function(req, res) {
    	var slug = req.params.id;

    	if(!mongoose.Types.ObjectId.isValid(slug)) {
    		res.send(401);
    	} else {

    		var goal_comment = new db.goal_comment();
    		goal_comment.save(function(err, result) {
    			var comment_id = result.id;

    			// Create a goal
    			var goal = new db.goal();
    			goal.title = req.body.name;
    			goal.description = req.body.description;
    			goal.bounty = parseInt(req.body.bounty);
    			goal.date_closing = moment().add(req.body.hours, 'h');
    			goal.comment_id = comment_id;
    			goal.author = slug;

    			goal.save(function(err, result) {
    				if(err) {
    					throw err;
    				}

    				res.redirect('/');
    			});

    		});
			}
    });

		router.get('/goal/:id', function(req, res) {
    	var slug = req.params.id;

    	if(!mongoose.Types.ObjectId.isValid(slug)) {
    		res.send(401);
    	} else {
    		db.goal.findById(slug, function(err, goal) {
    			if(err) {
    				throw err;
    			}

    			if(goal) {
    				db.goal_comment.findById(goal.comment_id, function(err, goal_comment) {
    					res.locals.comments = goal_comment;
    					res.locals.goal = goal;
							res.render('goal');
    				});
						
					} else {
						res.send(404);
					}
    		});
    	}
    });

		router.post('/goal/:id', function(req, res) {
			var slug = req.params.id;
			if(!mongoose.Types.ObjectId.isValid(slug)) {
    		res.send(401);
    	} else {
    		db.goal.findById(slug, function(err, goal) {
    			if(err) {
    				throw err;
    			}

    			if(goal) {
						var comment_id = goal.comment_id;
						db.goal_comment.findById(comment_id, function(err, goal_comment) {
							if(err) {
								throw errl
							}

							db.goal_comment.findByIdAndUpdate(
							comment_id,
							{$push: {"comment": {
								author: req.body.name,
								comment: req.body.comment,
								date_created : moment()
							}}},
							{safe: true, upsert: true},
							function(err, model) {
								res.redirect('/goal/' + goal._id);
							}
							);

						});
					} else {
						res.send(404);
					}
    		});
    	}
		});

		router.get('/comment/:id', function(req, res) {
    	var blob = req.params.id;

    	if(!mongoose.Types.ObjectId.isValid(blob)) {
    		res.send(401);
    	} else {

				db.end_user.findById(blob, function(err, comment) {
					if(err) {
						throw err;
					}
					var goal_comment = new db.goal_comment();
					var date_created = req.body.date_created;
					goal_comment.date_completed = moment().add(date_completed, 'h');

					goal_comment.save(function(err) {
					if (err)
					throw err;

					// if successful, do something..
					});

					if(comment) {
						res.locals.comment = comment;
						res.render('/goals');
					} else {
						res.send(404);
					}

				});
			}
    });
		// -------- Backend routes END -------- //






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