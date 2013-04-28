// Filename: homepageview.js
define(['jquery', 'underscore', 'backbone', 'bootstrap', 'text!tmpl/homepage.html'], function($, _, Backbone, Bootstrap, tmpl) {
	
	var ClassView = Backbone.View.extend({
		el : $('body'),
		render : function() {
			// Using Underscore we can compile our template with data
			var data = {};
			var compiledTemplate = _.template(tmpl, data);
			// Append our compiled template to this Views "el"
			this.$el.append(compiledTemplate);
		}
	});
	
	// Our module now returns our view
	return ClassView;
});
