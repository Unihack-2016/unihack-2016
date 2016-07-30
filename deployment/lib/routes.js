/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * routes.js
 *
 * Contains all app routes
 * ---------------------------------------------------------------- */


(function() {

	'use strict';

	var express   = require('express');
	var _         = require('underscore');
	var shortid   = require('shortid');

	var router    = express.Router();

	var passport = require('passport');
	var db       = require('./../../lib/db.js');
	var mongoose = require('mongoose');
	var moment   = require('moment');


/* ----------------------------------------------------------------
 * $routes
 * ---------------------------------------------------------------- */
	module.exports = function(app) {

		require('./../../lib/passport.js')(passport, app);

		// -------- Backend handler -------- //
		var handler = {
			get : {},
			post : {}
		};


		/**
		 * Renders dashboard
		 */
		handler.get.dashboard = function(req, res) {
			res.send('zz');
		};


		handler.auth = function(req, res, next) {
			if(req.isAuthenticated()) {
				return next();
			} else {
				res.sendStatus(401);
			}
		}


		// -------- Backend routes -------- //
    app.get('/auth/facebook', passport.authenticate('facebook-login', { scope : ['email'] }));

    app.get('/auth/facebook/callback',
    passport.authenticate('facebook-login', {
        successRedirect : '/',
        failureRedirect : '/'
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/profile/:id', function(req, res) {
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

		app.get('/goal/:id', function(req, res) {
    	var gg = req.params.id;

    	if(!mongoose.Types.ObjectId.isValid(gg)) {
    		res.send(401);
    	} else {

				db.end_user.findById(gg, function(err, goal) {
					if(err) {
						throw err;
					}

					var comments = [
						{
							name : 'zz',
							comment : 'blah',
							date_created : 'asd'
						}
					];

					if(goal) {
						res.locals.goal = goal;
						res.locals.comments = comments;
						res.render('goal');
					} else {
						res.send(404);
					}

				});
			}
    });


		app.get('/comment/:id', function(req, res) {
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

		router.route('/settings')
			.all(handler.auth)
			.get(handler.get.dashboard);
		// -------- Backend routes END -------- //

		return router;
	}

})();
