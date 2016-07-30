/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * db.js
 * 
 * Contains database functions and handles the connection
 * ---------------------------------------------------------------- */


(function() {

	'use strict';
	
	var globals = require('../config.js').vars;
	var mongojs = require('mongojs');
	
	var db    = mongojs(globals.mongoConnectionString(), ['image']);
	var image = db.collection('image');
	
	var exports = {
		findByUrl : function(url, cb) {
			db.image.find({'url':url}, cb);
		},
		createImage : function(data, cb) {
			var obj = {
				url     : data.url,
				tags    : data.tags || [],
				created : new Date()
			};
			db.image.save(obj, cb);
		},
		setTags : function(data, cb) {
			var query = {
				_id : mongojs.ObjectId(data.id)
			};
			var update = {
				$pushAll : {
					tags : data.tags
				}
			};
			db.image.update(query, update, cb);
		}
	};
	
	module.exports = exports;
	
})();