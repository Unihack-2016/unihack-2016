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

			name      : 'Goal',   // Will be used for creating the database
			plural    : 'Goals',  // Will be used in the backend UI
			slug      : '/goals', // Will be used in creating urls
			navName   : 'Goals',   // Optional; Will be used for the menu name

			schema : {
 				title : {
 					type    : String,
 					default : 'Post title',
 					fieldType : 'textarea'
 				},
 				description : {
 					type : String,
 					default : '',
 					fieldType : 'textarea'
 				},
 				date_created : {
 					type : Date,
 					default : new Date(),
 					fieldType : 'text'
 				},
 				date_closing : {
 					type : Date,
 					fieldType : 'text'
 				},
 				status : {
 					type : Boolean,
 					default : 1,
 					fieldType : 'text'
 				},
 				comment_id : {
 					type : String,
 					fieldType : 'text'
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