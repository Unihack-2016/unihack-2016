


var comments = [
	{
		id          : _.uniqueId('comment_'),
		created     : new Date(),
		authorEmail : 'shashwat.amin@yahoo.com',
		authorName  : 'Shash7',
		comment     : 'Muhahahaaa',
		x           : 75,
		y           : 50
	}
];


(function(window, document) {
	
	'use strict';
	
	
	// -------- Globals -------- //
	var views     = {};
	var models    = {};
	var templates = {};
	var common    = {};
	// -------- Globals END -------- //
	
	function compileTemplates() {
		$('.template').each(function() {
			var el = $(this);
			var name = el.data('name');
			templates[name] = _.template(el.html());
		});
	}
	
	function loadViews() {
		// -------- Picture class -------- //
		views.Header = Backbone.View.extend({
			initialize : function() {
			}
		});
		
		
		views.Picture = Backbone.View.extend({
			events : {
				'click' : 'onClick' 
			},
			initialize : function() {
				var el = $(this.el);
				this.outerHeight = el.parent().height();
				this.outerWidth = el.parent().width();
				if($(this.el).data('image')) {
					this.src = $(this.el).data('image');
				} else {
					this.src = 'http://41.media.tumblr.com/8c1b05dfc0e9e00e07d797cc58648d51/tumblr_nylvc9fUpo1r8gv56o1_1280.jpg';
				}
				//_.bindAll(this, 'centerImage');
				this.loadImage();
			},
			loadImage : function() {
				var self = this;
				$(this.el).find('.main-image').attr('src', this.src).load(function() {
					self.calibrateImage();
					self.centerImage();
				});
			},
			calibrateImage : function() {
				var el = $(this.el);
				var width = el.width();
				var height = el.height();
				if(width > this.outerWidth + 40 || height > this.outerHeight + 40) {
					var ratio;
					if(width > this.outerWidth + 40) { // The width of image is bigger
						console.log('width');
						ratio  = (this.outerWidth - 40) / width;
						height = height * ratio;
						width  = this.outerWidth - 40;
						el.width(width).height(height);
					} else if(height > this.outerHeight + 40) { // The height of image is bigger
						console.log('height');
						ratio = (this.outerHeight - 40) / height;
						width = width * ratio;
						height = this.outerHeight - 40;
						el.width(width).height(height);
					} else { // Assume image is bigger in both axis
						console.log('both');
					}
				}
			},
			centerImage : function() {
				var el = $(this.el);
				var width = el.width();
				var height = el.height();
				var x = this.outerWidth/2 + 10;
				x = x - width/2;
				var y = this.outerHeight/2 + 10;
				y = y - height/2;
				el.css({
					transform:"translate(" + x + "px," + y + "px)"
				})
			},

			onClick : function(e) {
				if(!common.commentList.isActive() || !$(e.target).hasClass('body__textarea')) {
					var el = $(this.el);
					var x = e.pageX - el.offset().left;
					var y = e.pageY - el.offset().top;
					common.commentList.addComment({
						x : x,
						y : y
					});
				}
			}
			
		});
		
		
		views.Comment = Backbone.View.extend({
			isFocused : false,
			hasChanged : false,
			events: {
				'blur .body__textarea' : 'onBlur',
				'keydown .body__textarea' : 'onKeydown'
			},
			initialize : function(obj) {
				this.id    = obj.id;
				this.x     = obj.x,
				this.y     = obj.y;
				this.saved = obj.saved;
				this.render(obj);
			},
			render : function() {
				var obj = {
					id : this.id,
					x : this.x,
					y : this.y
				};
				var self = this;
				$('.comment-list').append(templates.comment(obj));
				this.setElement($('.comment[data-id="' + this.id + '"]'));
				this.model = new models.Comment({
					id      : this.id,
					author  : '',
					content : ''
				});
				this.activate(function() {
					self.setFocus();
				});
			},
			activate : function(cb) {
				var self = this;
				setTimeout(function() {
					$(self.el).css('left',self.x).css('top',self.y).addClass('active');
					if(_.isFunction(cb)) {
						cb();
					}
				}, 200);
			},
			onBlur : function() {
				this.isFocused = false;
			},
			onKeydown : function() {
				var el = $(this.el);
				var val = el.find('.body__textarea').val();
				this.model.set({
					'content' : val
				});
			},
			setFocus : function() {
				var el = $(this.el);
				el.find('.body__textarea').focus();
				this.isFocused = true;
			},
			isEmpty : function() {
				var content = this.model.get('content');
				if(content.length > 0) {
					return false;
				} else {
					return true;
				}
			},
			destroy : function() {
				//this.model.destroy();
				this.undelegateEvents();
				this.$el.removeData().unbind(); 
				// Remove view from DOM
				this.remove();  
				Backbone.View.prototype.remove.call(this);
			}
		});
		
		models.Comment = Backbone.Model.extend({
			initialize : function() {
				
			}
		});
		
		views.CommentList = Backbone.View.extend({
			initialize : function() {
				this.comments = [];
				this.setElement($('.comment-list'));
			},
			buildList : function() {
				comments.map(function(comment) {
					
				});
			},
			addComment : function(cords) {
				this.clearInactive();
				var id = _.uniqueId('comment_');
				var comment = new views.Comment({
					x     : cords.x,
					y     : cords.y,
					id    : id,
					saved : false
				});
				this.comments.push(comment);
			},
			clearInactive : function() { // Remove empty comments
				this.comments.map(function(comment) {
					if(comment.isEmpty()) {
						comment.destroy();
					}
				});
			},
			isActive : function() {
				var result = false;
				this.comments.map(function(comment) {
					if(comment.isFocused) {
						result = true;
					}
				});
				return result;
			},
			uploadComments : function(cb) {
				var arr = [];
				this.comments.map(function(comment) {
					if(comment.hasChanged) {
						arr.push({

						});
					}
				});
				$.ajax({
					url: '',
					data: '',
					method: 'POST',
					success : function(data) {
						if(_.isFunction(cb)) {
							cb(false, data);
						}
					},
					error : function() {
						if(_.isFunction(cb)) {
							cb(true, data);
						}
					}
				});
			}
		});
		// -------- Picture class END -------- //
	}
	
	
	// -------- Bootstart -------- //
	function init() {
		compileTemplates();
		loadViews();
		
		common.header = new views.Header({
			el : $('.app-header')
		});
		common.picture = new views.Picture({
			el : $('.image-container')
		});
		common.commentList = new views.CommentList();
		
		$(window).resize(function() {
			picture.centerImage()
		});
	}
	
	//$(document).ready(init);
	// -------- Bootstart END -------- //
	
})(window, document);