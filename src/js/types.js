
window.routes = window.routes || {};

(function(window, document) {
	
	'use strict';

	var errorText = 'Looks like something went wrong. Please refresh the page';

	function onSubmit(e) {
		e.preventDefault();
		var el = $(this);
		var data = el.serializeArray();
		$.ajax({
			method : 'post',
			data : data,
			success : function(res) {
				var url = window.location.href + '/' + res._id;
				url = url.split("?")[0];
				url = url.replace(/([^:]\/)\/+/g, "$1");
				window.location.replace(url);
				
			},
			error : function(res) {
				$('.modal-content .form-description').text(errorText);
			}
		});
	}

	window.routes.types = {
		init : function() {
			$('#addPage').submit(onSubmit);
		}
	};
	
})(window, document);
