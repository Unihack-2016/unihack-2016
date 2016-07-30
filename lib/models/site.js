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
		metadata    : String,
		homepage    : String,
		errorpage   : String
	});

	module.exports = mongoose.model('Site', schema);
	
})();