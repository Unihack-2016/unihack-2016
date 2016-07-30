/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * page.js
 *
 * Contains page model
 * ---------------------------------------------------------------- */


(function() {

	'use strict';
	
	var mongoose         = require('mongoose');
	var mongoosePaginate = require('mongoose-paginate');
	var URLSlugs         = require('mongoose-url-slugs');

	var schema = new mongoose.Schema({
		title        : String,
		dateCreated  : Date,
		dateModified : Date,
		slug         : String,
		template     : String,
		metadata     : String,
		homepage     : String
	});

	schema.plugin(mongoosePaginate);
	schema.plugin(URLSlugs('title'));

	module.exports = mongoose.model('Page', schema);
	
})();