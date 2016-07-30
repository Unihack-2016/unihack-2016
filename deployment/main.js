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


		var routes = require('./lib/routes.js');

		var goal = {

			name      : 'goal',   // Will be used for creating the database
			plural    : 'Goals',  // Will be used in the backend UI
			slug      : '/goals', // Will be used in creating urls
			navName   : 'Goals',   // Optional; Will be used for the menu name

			schema : {
 				title : {
 					type    : String,
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
 				bounty : {
 					type : Number,
 					fieldType : 'text'
 				},
 				author : {
 					type : String
 				}
 			},

 			archiveTemplate : 'index'

		};

		var end_user = {

			name      : 'end_user',   // Will be used for creating the database
			plural    : 'End User',  // Will be used in the backend UI
			slug      : '/end-user', // Will be used in creating urls
			navName   : 'End-user',   // Optional; Will be used for the menu name

			schema : {
 				name : {
 					type    : String,
 					fieldType : 'text'
 				},
 				facebook_id : {
 					type : String,
 					fieldType : 'text'
 				},
 				facebook_token : {
 					type : String,
 					fieldType : 'text'
 				},
 				password : {
 					type : String,
 					default : '',
 					fieldType : 'text'
 				},
 				date_created : {
 					type : Date,
 					default : new Date(),
 					fieldType : 'text'
 				},
 				email : {
 					type : String,
 					fieldType : 'text'
 				},
 				goals_created : {
 					type : Array,
 					fieldType : 'text'
 				},
 				goals_completed : {
 					type : String,
 					fieldType : 'text'
 				},
 				bounty : {
 					type : Number,
 					fieldType : 'text'
  			}
 			},

 			archiveTemplate : 'index'

		};


		var goal_comment = {

			name      : 'goal_comment',   // Will be used for creating the database
			plural    : 'Goal comments',  // Will be used in the backend UI
			slug      : '/goal-comment', // Will be used in creating urls
			navName   : 'goal-comment',   // Optional; Will be used for the menu name

			schema : {
 				comment : {
 					type      :  Array,
 					fieldType : 'text'
 				}
 			},

 			archiveTemplate : 'index'

		};

		cms.defineType(end_user);
		cms.defineType(goal);
		cms.defineType(goal_comment);

		app.use(routes(app));
	}

})();