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
		description  : String,
		date_created : Date,
		date_closing : Date,
		status       : Boolean,
		comment_id   : String
	});

	schema.plugin(mongoosePaginate);
	//schema.plugin(URLSlugs('title'));

	module.exports = mongoose.model('Page', schema);
	
})();