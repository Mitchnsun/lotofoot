// Filename: homepageview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'text!tmpl/homepage.html'],
function($, _, Backbone, te, tmpl) {
	
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		render : function() {
			$(this.el).html(te.renderTemplate(tmpl, {title : "Lotofoot"}));
		}
	});
	
	// Our module now returns our view
	return ClassView;
});
