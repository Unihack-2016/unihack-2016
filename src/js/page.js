
window.rawTemplate = window.rawTemplate || {};
window.routes = window.routes || {};

(function(window, document) {
	
	'use strict';

	window.nunjucks = new nunjucks.Environment();

	var num = 0;
	nunjucks.addFilter('generateId', function(val) {
		num += 1;
		return val + '_' + num;
	});

	var inc = 0;

	function generateId() {
		inc += 1;
		return 'repeater-' + inc;
	}

	function parseNav(str) {
		var pattern = /\[(.*?)\]/g;
		var matches = [];
		var match;
		while((match = pattern.exec(str)) != null) {
			matches.push(match[1]);
		}
		return matches;
	}

	function traverse() {

	}

	function calculateDepth(arr) {
		var len = arr.length;

		if(len%2 === 0) {
			for(var i = 0; i < len; i++) {
				
			}
		} else {
			return;
		}
	}

	window.routes.page = {
		addRow : function() {
			var el = $(this);
			var id = el.data('id');
			var nav = el.parent().data('depth');
			nav = parseNav(nav);

			var fieldName = nav[0];

			var fields = rawTemplate.fields;
			console.log(fields);
			var listItem;
			for(var key in fields) {
				if(fields.hasOwnProperty(key)) {
					if(fields[key].name === fieldName) {
						listItem = fields[key];
					}
 				}
			}
			var dom = nunjucks.render('list-row-client.html', listItem);
			$('.list__row-container[data-id="' + id +'"]').append(dom);
		},
		removeRow: function() {
			var el = $(this);
			var id = el.data('id');
			$('.repeater__row[data-id="' + id + '"]').remove();
		},
		setEditors : function() {
			tinymce.init({
				selector : '.form-texteditor'
			})
		},
		init : function() {
			$(document).on('click', '.button-add-row',this.addRow);
			$(document).on('click', '.repeater__controls',this.removeRow);

			this.setEditors();
		}
	};
	
})(window, document);
