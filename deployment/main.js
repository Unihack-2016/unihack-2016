#!/bin/env node

/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * index.js
 * 
 * Boots the server
 * ---------------------------------------------------------------- */

(function() {
	
	module.exports = function(cms, app, db) {

		var obj = {

			name      : 'Picture',   // Will be used for creating the database
			plural    : 'Pictures',  // Will be used in the backend UI
			slug      : '/pictures', // Will be used in creating urls
			navName   : 'Pictures',   // Optional; Will be used for the menu name

			schema : {
 				title : {
 					type    : String,
 					default : 'Post title',
 					fieldType : 'textarea'
 				},
 				author : {
 					type : String
 				}
 			},

 			archiveTemplate : 'index'

		};

		cms.defineType(obj);
	}

})();