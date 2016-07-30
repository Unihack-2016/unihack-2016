/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * globals.js
 *
 * Contains setters and getters to store and retrieve global vars
 * ---------------------------------------------------------------- */


(function() {

	'use strict';

	var _ = require('underscore');

	var arr = [];

	module.exports = {
		arr : [],
		get : function(name) {
			var result = null;
			this.arr.map(function(item) {
				if(name === item.name) {
					result = item.data;
				}
			});
			return result;
		},
		set : function(name, obj) {
			this.arr.push({
				name : name,
				data : obj
			});
		},
		remove : function(name) {
			var result = [];
			this.arr = this.arr.map(function(item) {
				if(name !== item.name) {
					result.push(item);
				}
			});
			this.arr = result;
		}
	}

})();