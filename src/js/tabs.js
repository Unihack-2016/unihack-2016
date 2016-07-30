


(function(window, document) {
	
	'use strict';

	var tabs = [];

	function toggleTab() {
		
	}

	function attachEvents() {
		tabs.map(function(tab) {
			$('[data-tab="' + tab + '"]').click(function() {

			});
		});
	}
	
	function Tabs() {

	}

	Tabs.prototype.start = function() {
		$('.tabs').each(function() {
			var el = $(this);
			var name = el.data('tab');
			tabs.push(name);
		});

		attachEvents();
	}
	
	// -------- Bootstart -------- //
	function init() {
		var tabs = new Tabs();
		tabs.start();
	}
	
	$(document).ready(init);
	// -------- Bootstart END -------- //
	
})(window, document);