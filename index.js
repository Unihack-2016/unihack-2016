#!/bin/env node

/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * index.js
 * 
 * Boots the server
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';

	var fs       = require('fs');
	var YAML     = require('yamljs');
	//var manifest = require('asset-builder')('./src/manifest.json');
	var App      = require('./lib/app.js');

	// Load config options
	var data = fs.readFileSync('./config.yaml', 'utf8');
	data = YAML.parse(data);

	// Start app
	var app = new App(data);
	app.start();
	
})();