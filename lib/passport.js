/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * passport.js
 * 
 * Contains all passport-local stuff
 * ---------------------------------------------------------------- */

var LocalStrategy   = require('passport-local').Strategy;
var db              = require('./db.js');

// expose this function to our app using module.exports
module.exports = function(passport, app) {

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		db.User.findById(id, function(err, user) {
			if(err) throw err;
			if(!user) {
				user = false;
			}
			done(err, user);
		});
	});

	/**
	 * Local login strategy for passport
	 */
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password'
	},
	function(email, password, done) {
		db.User.findOne({email : email}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user || user.length === 0) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, {message: 'Oops! Wrong password.'});
			}
			return done(null, user);
		});
	}));

	/**
	 * Local signup strategy
	 */
	passport.use('local-signup', new LocalStrategy({
				// by default, local strategy uses username and password, we will override with email
				usernameField : 'email',
				passwordField : 'password',
				passReqToCallback : true // allows us to pass back the entire request to the callback
		},
	function(req, email, password, done) {
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		process.nextTick(function() {

			db.User.findOne({ 'email' :  email }, function(err, user) {
				// if there are any errors, return the error
				if (err)
						return done(err);

				if (user) {
						return done(null, false, req.flash('message', 'That email is already taken.'));
				} else {

					// if there is no user with that email
					// create the user
					var newUser            = new db.User();

					// set the user's local credentials
					newUser.name     = req.body.name;
					newUser.email    = email;
					newUser.password = newUser.generateHash(password);
					newUser.date     = new Date();

					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						app.locals.site.isActive = true;
						return done(null, newUser);
					});
				}

			});

		});

	}));
	

};