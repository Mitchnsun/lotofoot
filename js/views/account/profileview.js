define(['jquery', 'underscore', 'backbone',
		'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
		'i18n!tmpl/account/nls/account',
		'text!tmpl/account/profile.html'],
function($, _, Backbone, te, LotofootApi, urls, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
			this.eventBus = options.eventBus;
		},
		el : $('#container'),
		render : function() {
			$(this.el).html(te.renderTemplate(tmpl, {i18n : i18n}));
		},
		/*
		 * Events of the view
		 */
		events : {},
		displayErrors : function(errors){
			var errorMessage = "";
			_.each(errors,function(key){
				errorMessage += i18n.errors[key] + " ";
			});
			this.alertview.displayAlert('warning', 'default', errorMessage);
		}
	});

	// Our module now returns our view
	return ClassView;
}); 