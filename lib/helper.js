/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * helper.js
 * 
 * Contains all helper functions
 * ---------------------------------------------------------------- */


(function() {

	'use strict';

	var YAML      = require('yamljs');
	var fs        = require('fs');
	var async     = require('async');
	var _         = require('underscore');
	var nunjucks  = require('nunjucks');
	var moment    = require('moment');
	var shortid   = require('shortid');
	var form      = require('./fields.js');
	
	var adminEnv  = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));
	adminEnv.addFilter('dump', function(obj) {
		var str = '<script>console.log(' + JSON.stringify(obj) + ');</script>';
		return str;//'<pre><code>' + JSON.stringify(obj) + '</code></pre>';
	});
	adminEnv.addFilter('renderDate', function(val) {
		return moment(val).format("Do MMMM YYYY");
	});

	adminEnv.addFilter('generateId', function(val) {
		return val + '_' + shortid.generate();
	});

	adminEnv.addFilter('renderFormattedDate', function() {
		return moment().format("dddd, MMMM") + " the " + moment().format("Do, h:mma");
	});

	adminEnv.addFilter('format', function(val, str) {
		return moment(val).format(str);
	});

	adminEnv.addFilter('setObject', function(obj, val) {
		if(val) {
			return obj = val;
		}
	});

	var navItems = [
		{
			name    : 'Dashboard',
			navName : 'dashboard',
			slug    : ''
		},
		{
			name   : 'Pages',
			navName : 'pages',
			slug    : '/pages'
		},
		{
			name   : 'Media',
			navName : 'media',
			slug    : '/media'
		},
		{
			name    : 'Options',
			navName : 'options',
			slug    : '/options',
		},
		{
			name    : 'Settings',
			navName : 'settings',
			slug    : '/settings'
		}
	];

	module.exports = {
		
		/**
		 * Sanitizes string to be used as a url
		 * 
		 * @param  {[string]}
		 * @return {[string]}
		 */
		sanitizeUrl : function(url) {
			url = url.replace(/[^a-zA-Z ]/g, "");
			url = url.replace(/\s+/g, '-').toLowerCase();
			return url;
		},

		/**
		 * Renders template from the backend views path.
		 * Because it is vital to keep the frontend and backend views path different
		 * 
		 * @param  {object} res      [The res object from an express route]
		 * @param  {string} template [The name of the template to render]
		 * @param  {Object} data     [Optional. Pass fields, ids, etc to the template]
		 */
		render : function(res, template, data) {
			var vars = _.clone(res.locals);
			if(data) {
				vars = _.extend(vars, data);
			}
			//console.log(res.locals);
			var html = adminEnv.render(template, vars);
			res.send(html);
		},

		/**
		 * Loads templates and blueprints and returns a callback
		 * with an array containing a hash of them
		 * 
		 * @param  {String}
		 * @param  {Function}
		 */
		loadTemplates : function(depPath, cb) {
			var arr = [];
			var blueprintdir = depPath + '/blueprints';
			var templatedir = depPath + '/templates';

			var arr = [blueprintdir, templatedir];

			var success = [];

			// ---- async ---- //
			async.map(arr, function(folderPath, callback) {
				fs.readdir(folderPath, function(err, filenames) {
					callback(null, filenames);
				});
			}, function(err, results) {

				var blueprints = results[0].map(function(blueprint) {
					return blueprintdir + '/' + blueprint;
				});

				async.map(blueprints, function(filePath, callback) {
					fs.readFile(filePath, 'utf-8', function(err, content) {
						callback(err, content);
					});
				}, function(err, data) {
					data = data.map(function(res) {
						return YAML.parse(res);
					});
					var templates = results[1] || [];
					var options = {};
					data = data.filter(function(obj) {
						if(obj) {
							if(!obj.options) {
								obj.exists = false;
								templates.map(function(template) {
									if(template.split('.')[0] === obj.template) {
										obj.exists = true;
									}
								});
							} else {
								options = obj.fields;
							}
							if(obj.exists || obj.options) {
								return true;
							} else {
								return false;
							}
						} else {
							return false;
						}
					});
					var result = [];
					data = data.map(function(obj) {
						if(!obj.options) {
							result.push({
								template : obj.template + '.html',
								name : obj.template,
								fields: form.validateFields(obj.fields)
							});
						}
					});

					cb({
						options : options,
						templates : result
					});
				});
			});
			// ---- async END ---- //

		},

		findTemplate : function(templates, name) {
			var result = false;
			templates.map(function(template) {
				if(name === template.name) {
					result = template;
				}
			});
			return result;
		},


		validateField : function(field, depth) {
			depth = depth || '';
			field.size = field.size || 12;
			field.depth = depth;

			return field;
		},

		traverseArray : function(arr, depth) {
			var self = this;
			var depth = depth;

			function printArray(arr, depth){

				for(var i = 0; i < arr.length; i++) {
					if(arr[i].type === 'repeater') {
						depth = depth + '[' + arr[i].name + '][0]';
						arr[i].fields = printArray(arr[i].fields, depth);
						arr[i].depth = depth;
					}
					arr[i] = self.validateField(arr[i], depth);
				}
				return arr;
			}

			printArray(arr, depth);

			return arr;
		},

		setListArray : function(arr, depth) {

			for(var i = 0, len = arr.length; i < len; i++) {
				arr[i] = this.validateField(arr[i], depth);
			}
			return [arr];
		},

		/**
		 * Add field validations here
		 * @param  {Array} fields [Array of fields]
		 * @return {Array}        [Modified array of fields]
		 */
		trimFields : function(fields) {
			var self = this;
			fields = fields.map(function(field) {
				if(field.type === 'repeater') {
					var depth = '[' + field.name + '][0]';
					field.fields = self.traverseArray(field.fields, depth);
					field = self.validateField(field, depth);
				} else if(field.type === 'list') {
					var depth = '[' + field.name + '][0]';
					field.fields = self.setListArray(field.fields, depth);
					field = self.validateField(field, depth);
				} else {
					field = self.validateField(field);
				}
				return field;
			});
			return fields;
		},

		injectValue : function(obj, data) {
			var key = obj.name;
			if(data) {
				obj.value = data[key] || '';
			}
			return obj;
		},

		/**
		 * Merges template with values typically pulled from the database
		 * @param  {Array}  fields [Template fields]
		 * @param  {String} json   [JSON stringified string containing fields]
		 * @return {Array}         [Returns template fields injected with values]
		 */
		util : require('util'),
		traverseRows : function(template, data, tail) {
			var self = this;

			var rows = [];
			if(data) {
			for(var i = 0, len = data.length; i < len; i++) {
				var row = [];

				var temp = _.map(template, _.clone);
				for(var j = 0, arrLen = temp.length; j < arrLen; j++) {
					var name = temp[j].name;
					if(data[i][name]) {
						if(temp[j].type === 'repeater') {
							temp[j].fields = self.traverseRows(temp[j].fields, data[i][name], true);
						} else {
							temp[j] = self.injectValue(temp[j], data[i]);
						}
					} else {
						break;
					}
					row.push(temp[j]);
				}
				rows.push(row);
			}
			}

			return rows;
		},
		interpolateTemplateData : function(fields, json) {
			var self = this;
			//console.log(this.util.inspect(fields, {showHidden: false, depth: null}));	
			if(json) {
				var data = JSON.parse(json);
				for(var i = 0, len = fields.length; i < len; i++) {
					var key = fields[i].name;
					if(fields[i].type === 'repeater') {
						fields[i].fields = self.traverseRows(fields[i].fields, data[key]);
						//fields[i].fields = self.injectArray(fields[i], data[key]);
					} else {
						fields[i] = self.injectValue(fields[i], data);
					}
				}
			}
			//console.log(this.util.inspect(fields, {showHidden: false, depth: null}));
			//console.log(this.util.inspect(fields, {showHidden: false, depth: null}));
			return fields;
		},

		/**
		 * Constructs base admin url, for eg: http://acme.inc/backend
		 * @param  {Object[express]} req         [Pass req from an express route]
		 * @param  {String}          backendPath [Pass the backendpath]
		 * @return {String}                      [Get url]
		 */
		constructAdminUrl : function(req, backendPath) {
			return req.protocol + '://' + req.get('host') + backendPath;
		},

		constructNav : function(page, res) {
			var types = res.app.locals.types || null;
			var arr = [];
			navItems.map(function(item) {
				if(item.name === 'Pages' && types) {
					types.map(function(type) {
						arr.push({
							name    : type.name,
							slug    : type.slug,
							navName : type.navName
						});
					});
				}
				arr.push(item);
			});

			// Check which one is active
			arr = arr.map(function(item) {
				item.active = false;
				if(res.locals.pageName === item.navName.toLowerCase()) {
					item.active = true;
				}
				return item;
			});

			return arr;
		},

		setupVars : function(req, res, next) {
			var path = req.originalUrl;
			path = path.split('?')[0]; // Remove querystring if any
			var arr = path.split('/');
			var type = '';
			var name = '';
			var len = arr.length;
			var page = '';
			var extra = '';

			var temp = arr[len - 1];
			if(!temp[temp.length - 1]) {
				arr.pop(len - 1);
				len -= 1;
			}

			// 2 : root
			// 3 : Either a single page or pages/types root
			// 4 : Subpage of pages or a single type
			// 5 : Type subpage
			// 6 : Type single page
			if(len === 2) {
				type = 'root';
				name = 'dashboard';
				extra = name;
			} else if(len === 3) {
				type = 'page';
				name = arr[2];
				extra = name;
				if(name !== 'pages') {
					name = 'types';
				}
			} else if(len === 4) {
				type = 'subpage'
				name = 'subpage-' + arr[len - 1];
				extra = 'page';
				if(arr[2] === 'types') {
					type = 'page';
					name = arr[len - 1];
				}
			} else if(len === 5) {
				type = 'subpage';
				name = 'subpage-' + arr[len - 1];
				extra = arr[len - 1];
			}
			path = req.app.locals.paths.backend;

			// Check if path contains backslash. Just in case..
			if(path[0] === '/') {
				path = path.substr(1);
			}
			var bodyClasses = [
				'admin',
				'path-' + path,
				type,
				name
			];

			// Join classes and pass along
			res.locals.pageName = extra;
			res.locals.bodyClasses = bodyClasses.join(' ');
			res.locals.site = req.app.locals.site;
			res.locals.paths = {
				host    : req.protocol + '://' + req.get('host'),
				backend : req.protocol + '://' + req.get('host') + req.app.locals.paths.backend,
				url     : req.originalUrl
			};

			// Set nav object
			res.locals.nav = module.exports.constructNav(name, res);

			// Set flash variables
			req.flash('message', 'Helper is going derp derp');
			res.locals.flash = req.flash('message');

			/**
			 * At this point res.locals will have the following:
			 * pageName
			 * bodyClasses
			 * paths
			 * site
			 * nav
			 * flash
			 */
			next();
		}

	}
	
})();