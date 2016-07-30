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
        successRedirect : '/?login=true',
        failureRedirect : '/'
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

		router.route('/settings')
			.all(handler.auth)
			.get(handler.get.dashboard);
		// -------- Backend routes END -------- //

		return router;
	}
	
})();