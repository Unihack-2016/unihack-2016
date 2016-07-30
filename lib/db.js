/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * db.js
 * 
 * Contains database functions and handles the connection
 * ---------------------------------------------------------------- */


(function() {

	'use strict';


	var async    = require('async');
	var mongoose = require('mongoose');
	var bcrypt   = require('bcrypt-nodejs');
	var shortid  = require('shortid');
	var helper   = require('./helper');

	var mongoosePaginate = require('mongoose-paginate');
	var URLSlugs         = require('mongoose-url-slugs');

	var dbName   = 'test';		


	/**
	 * Generates connection string based on the env variables
	 * @return {String} [connection strin]
	 */
	function connectionString() {
		var str  = '';
		var host = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
		var port = process.env.OPENSHIFT_NODEJS_PORT || 27017;

		if(process.env.MONGODB_URL) {
			str = process.env.MONGODB_URL + dbName;
			/*str = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
				process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
				process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
				process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
				process.env.OPENSHIFT_APP_NAME;*/
		} else {
			str = host + ':' + port + '/' + dbName;
		}
		return 'mongodb://shash:123@ds031845.mlab.com:31845/heroku_wfg11dmc';//str;
	}

	mongoose.connect(connectionString());

	var User = require('./models/user.js');
	var Page = require('./models/page.js');
	var Site = require('./models/site.js');

	var exports = {
		User : User,
		Page : Page,
		Site : Site,

		/**
		 * Creates schema for content types
		 * @param  {Object} schema [Object describing schema]
		 * @param  {String} name   [Name of the schema]
		 */
		createType : function(schema, name) {
			var schema = new mongoose.Schema(schema);
			schema.plugin(mongoosePaginate);
			//schema.plugin(URLSlugs('title'));
			this[name] = mongoose.model(name, schema);
		}
	};
	
	module.exports = exports;
	
})();