/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * passport.js
 * 
 * Contains all passport-local stuff
 * ---------------------------------------------------------------- */

var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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
			if(user === false) {
				db.end_user.findById(id, function(err, end_user) {

					if(!end_user) {
						end_user = false;
					}
					done(err, user);
				});
			} else {
				done(err, user);
			}
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


	/**
	 * Local login strategy for passport
	 */
	passport.use('facebook-login', new FacebookStrategy({
		// pull in our app id and secret from our auth.js file
		clientID        : '304773096539239',
		clientSecret    : '4b8545c1a6327c1b4727cc4d7f39f881',
		callbackURL     : 'http://unihack-app.herokuapp.com/auth/facebook/callback',
		passReqToCallback : true,
    profileFields: ['id', 'emails', 'name'] //This
	},
	function(sess, token, refreshToken, profile, done) {
		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
			db.end_user.findOne({ 'facebook_id' : profile.id }, function(err, user) {
			// if there is an error, stop everything and return that
			// ie an error connecting to the database
			if (err)
			return done(err);

			// if the user is found, then log them in
			if (user) {
			return done(null, user); // user found, return that user
			} else {

			if(!profile.emails) {
				return done(err);
			}
			// if there is no user found with that facebook id, create them
			var newUser            = new db.end_user();

			// set all of the facebook information in our user model
			newUser.facebook_id    = profile.id; // set the users facebook id                   
			newUser.facebook_token = token; // we will save the token that facebook provides to the user                    
			newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
			newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

			// save our user to the database
			newUser.save(function(err) {
			if (err)
			throw err;

			// if successful, return the new user
			return done(null, newUser);
			});
			}

			});
		});

	}));
	

};