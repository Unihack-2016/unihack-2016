/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * backend.js
 * 
 * Contains all backend routes
 * ---------------------------------------------------------------- */


(function() {

	'use strict';
	
	var express   = require('express');
	var _         = require('underscore');
	var appConfig = require('../config.js');
	var db        = require('./db.js');
	var helper    = require('./helper.js')
	var shortid   = require('shortid');
	var globals   = require('./globals.js');
	var form      = require('./fields.js');

	var router     = express.Router();

	var passport = require('passport');
	
	
/* ----------------------------------------------------------------
 * $routes
 * ---------------------------------------------------------------- */
	module.exports = function(app) {

		require('./passport')(passport, app);
		var pageRouter = require('./pages.js')(app);
		var typeRouter = require('./types.js')(app);

		// -------- Backend handler -------- //
		var handler = {
			get : {},
			post : {}
		};


		/**
		 * Renders dashboard
		 */
		handler.get.dashboard = function(req, res) {
			if(app.locals.site.isActive) {
				if(req.isAuthenticated()) {
					var pageName = 'dashboard';
					//var nav = helper.constructNav(pageName, helper.constructAdminUrl(req, vars.backendPath));
					helper.render(res, 'wrapper.html', {
						page : 'dashboard',
						//nav : nav,
					});
				} else {
					res.redirect(req.protocol + '://' + req.get('host') + app.locals.paths.backend + '/login');
				}
			} else {
				res.redirect(req.protocol + '://' + req.get('host') + app.locals.paths.backend + '/signup');
			}
		};

		/**
		 * Renders login page
		 */
		handler.get.login = function(req, res) {
			if(req.isAuthenticated()) {
				res.redirect(req.protocol + '://' + req.get('host') + app.locals.paths.backend);
			} else {
				helper.render(res, 'login.html');
			}
		};

		/**
		 * Renders options page
		 */
		handler.get.options = function(req, res) {
			var options = app.locals.templates.optionsCache;
			if(typeof options === 'string') {
				options = JSON.parse(options);
			}
			options = form.interpolateFields(app.locals.templates.options,options)
			res.locals.fields = options;
			helper.render(res, 'wrapper.html');
		};

		handler.post.options = function(req, res) {
			var data = req.body.fields;
			var id   = app.locals.templates.optionsID;
			if(data) {
				app.locals.templates.optionsCache = JSON.parse(JSON.stringify(data[0]));
				data = JSON.stringify(data[0]);
				db.Site.update({_id : id}, {metadata: data}, function(err, doc) {
					if(doc) {
						res.redirect('back');
					}
				});
			} else {
				res.redirect('back');
			}
			
		};


		/**
		 * Renders settings page
		 */
		handler.get.settings = function(req, res) {
			var options = app.locals.templates.optionsCache;
			if(typeof options === 'string') {
				options = JSON.parse(options);
			}
			options = form.interpolateFields(app.locals.templates.options,options)
			res.locals.fields = options;
			helper.render(res, 'wrapper.html');
		};

		handler.post.settings = function(req, res) {
			var data = req.body.fields;
			var id   = app.locals.templates.optionsID;
			if(data) {
				app.locals.templates.optionsCache = JSON.parse(JSON.stringify(data[0]));
				data = JSON.stringify(data[0]);
				db.Site.update({_id : id}, {metadata: data}, function(err, doc) {
					if(doc) {
						res.redirect('back');
					}
				});
			} else {
				res.redirect('back');
			}
			
		};

		handler.get.logout = function(req, res) {
			req.logout();
			res.redirect('/');
			
		};

		handler.get.signup = function(req, res) {
			/*if(!app.locals.site.isActive) {
				helper.render(res, 'signup.html');
			} else {
				res.redirect('/');
			}*/
			helper.render(res, 'signup.html');
		};

		handler.auth = function(req, res, next) {
			if(req.isAuthenticated()) {
				return next();
			} else {
				res.sendStatus(401);
			}
		}
		// -------- Backend handler END -------- //



		// -------- Backend routes -------- //
		router.route('/login')
    	.all(helper.setupVars)
			.get(handler.get.login)
			.post(passport.authenticate("local-login", {
				failureRedirect: app.locals.paths.backend + "/login",
				successRedirect : ".." + app.locals.paths.backend
			}));
		
		router.route('/signup')
			.get(handler.get.signup)
			.post(passport.authenticate('local-signup', {
        successRedirect : app.locals.paths.backend, // redirect to the secure profile section
        failureRedirect : app.locals.paths.backend + '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    	}));

    router.get('/logout', handler.auth, handler.get.logout);

    router.route('/')
    	.all(handler.auth)
    	.all(helper.setupVars)
			.get(handler.get.dashboard);

		router.route('/options')
			.all(handler.auth)
    	.all(helper.setupVars)
			.get(handler.get.options)
			.post(handler.post.options);

		router.route('/settings')
			.all(handler.auth)
    	.all(helper.setupVars)
			.get(handler.get.settings)
			//.post(handler.post.options);
		// -------- Backend routes END -------- //
		

		router.use('/pages', [handler.auth, helper.setupVars], pageRouter);
		router.use(express.static(__dirname + '/../public'));
		router.use('/', [handler.auth, helper.setupVars], typeRouter);

		

		router.use('*', function(req, res) {
			res.send(404);
		});

		return router;
	}
	
})();