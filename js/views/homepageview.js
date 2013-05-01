// Filename: homepageview.js
define(['jquery', 'underscore', 'backbone', 'bootstrap', 'fmk/templateengine', 'text!tmpl/homepage.html'],
function($, _, Backbone, Bootstrap, te, tmpl) {
	
	var ClassView = Backbone.View.extend({
		el : $('body'),
		render : function() {
			$(this.el).html(te.renderTemplate(tmpl, {title : "Lotofoot"}));
		}
	});
	
	// Our module now returns our view
	return ClassView;
});
