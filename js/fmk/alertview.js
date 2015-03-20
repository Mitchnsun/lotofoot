define(['jquery', 'underscore', 'backbone',
				'fmk/templateengine', 'i18n!nls/wordings', 'text!fmk/alert.html'],
function($, _, Backbone, te, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		el : $('#container'),
		render : function(type) {
			this.dismissAlert();
			$(this.el).prepend(te.renderTemplate(tmpl, {
				type : type,
				msg : this.msg
			}));
			$('body').animate({scrollTop : $(this.el).position().top}, 'slow');
		},
		/*
		 * displayError : error messages are displayed with a status (ex: 500) and a code
		 */
		displayError : function(status, code) {
			this.msg = {
				"Title" : i18n.alert.default_Title
			};

			if (status) {
				this.msg.status = i18n.alert[status];
			}
			if (code) {
				this.msg.message = i18n.alert[code]?i18n.alert[code]:this.getMessage(status);
			} else {
				this.msg.message = this.getMessage(status);
			}

			var type = this.setType('error');

			this.render(type);
		},
		/*
		 * Three type of alert : success, info and warning (default).
		 * code is for the message to display.
		 */
		displayAlert : function(type, title, msg) {
			if (i18n.alert[title + "_Title"] !== undefined) {
				this.msg = {
					"Title" : i18n.alert[title + "_Title"]
				};
			} else {
				this.msg = {
					"Title" : title
				};
			}

			if (msg) {
				this.msg.message = msg;
			}

			type = this.setType(type);

			this.render(type);
		},
		getMessage : function(status) {
			return i18n.alert['message_' + status];
		},
		setType : function(type) {// add the specific class to the alert bloc
			switch(type) {
				case 'error':
					return 'alert-danger';
				case 'success':
					return 'alert-success';
				case 'info':
					return 'alert-info';
				default:
					return 'alert-warning';
			}
		},
		/*
		 * Events of the view
		 * dismissAlert : function to remove the alert from DOM
		 */
		events : {
			'click .close' : 'dismissAlert'
		},
		dismissAlert : function(e) {
			if (e !== undefined) {
				e.preventDefault();
			}
			this.$('.AlertView').remove();
		},
		/*
		 * Unbind : the view is removed from the DOM
		 */
		unbind : function() {
			this.undelegateEvents();
		}
	});

	// Our module now returns our view
	return ClassView;
});