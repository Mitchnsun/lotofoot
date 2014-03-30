define(['jquery', 'underscore', 'backbone', 'fmk/templateengine',
				'i18n!tmpl/ranking/nls/ranking', 'text!tmpl/ranking/ranking.html'],
function($, _, Backbone, te, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
		},
		render : function() {
			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n
			}));
		}
	});

	// Our module now returns our view
	return ClassView;
}); 