/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * fields.js
 *
 * Manages form fields
 * - Validates fields
 * - Interpolates fields with db data
 * ---------------------------------------------------------------- */


(function() {

	'use strict';


	var async    = require('async');
	var mongoose = require('mongoose');
	var bcrypt   = require('bcrypt-nodejs');
	var shortid  = require('shortid');
	var helper   = require('./helper');
	var _        = require('underscore');

	var fields = [
		{
			name : 'text',
			validate : function(obj, name) {
				obj.name        = name;
				obj.size        = obj.size || 12;
				obj.label       = obj.label || name;
				obj.description = obj.description || '';
				return obj;
			}
		},
		{
			name: 'textarea',
			validate : function(obj, name) {
				obj.name = name;
				obj.size = obj.size || 12;
				return obj;
			}
		},
		{
			name : 'line',
			validate : function(obj) {
				return obj;
			}
		},
		{
			name : 'texteditor',
			validate : function(obj, name) {
				obj.name        = name;
				obj.size        = obj.size || 12;
				obj.label       = obj.label || 'Text box';
				obj.description = obj.description || '';
				return obj;
			}
		},
		{
			name : 'list',
			validate : function(obj) {
				if(!obj.fields) return null;

				obj.size = obj.size || 12;
				obj.fields = exports.validateFields(obj.fields);
				return obj;
			}
		}
	];

	/**
	 * Check if a field exists. If yes, return the field.
	 * @param  {Object} field   [The field]
	 * @return {Object | false} [The field]
	 */
	function fieldExists(field) {

		var type = field.type || '';

		var success = null;
		fields.map(function(f) {
			if(f.name === type) {
				success = f;
			}
		});

		return success;
	}

	var exports = {

		/**
		 * Validates form fields.
		 * @param  {Object} fields [Form fields]
		 * @return {Object}        [Modified form fields]
		 */
		validateFields : function(fields) {

			for(var key in fields) {
				if(fields.hasOwnProperty(key)) {

					var field = fields[key];
					var ruleset = fieldExists(field);
					if(ruleset) {
						field = ruleset.validate(field, key);
					} else {
						delete fields[key];
					}

				}
			}

			return fields;
		},

		/**
		 * Interpolates fields with form data. Returns a new cloned object
		 * @param  {Object} fields [Form fields template]
		 * @param  {Object}   data [Metadata retrieved from database]
		 * @return {Object}        [Form fields with data values]
		 */
		interpolateFields : function(fields, data) {

			// Clone fields old skool style
			fields = JSON.parse(JSON.stringify(fields));

			// Loop through template fields
			for(var key in fields) {
				if(fields.hasOwnProperty(key)) {

					if(fields[key].type === 'list') {
						if(data[key]) {
							// loop though fields[key].fields
						}
					}


					if(data[key]) {
						fields[key].value = data[key];
					}

				}
			}

			return fields;
		}
	};


	module.exports = exports;
	
})();