/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * routes.js
 * 
 * Contains all routes
 * ---------------------------------------------------------------- */


(function() {

	'use strict';
	
	var mongoose   = require('mongoose');
	var bcrypt     = require('bcrypt-nodejs');

	var schema = new mongoose.Schema({
		name        : String,
		email       : String,
		password    : String,
		dateCreated : Date
	});

	schema.methods.generateHash = function(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	// checking if password is valid
	schema.methods.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password);
	};

	module.exports = mongoose.model('User', schema);
	
})();