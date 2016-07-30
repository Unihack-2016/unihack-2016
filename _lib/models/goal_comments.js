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
		comments : [
		{
			name         : String,
			_id          : String,
			comment      : String,
			date_created : Date
		}
		]
	});

	schema.plugin(mongoosePaginate);
	//schema.plugin(URLSlugs('title'));

	module.exports = mongoose.model('Page', schema);
	
})();