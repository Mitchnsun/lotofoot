// Filename: homepageview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi',
        'fmk/urls', 'i18n!tmpl/nls/homepage', 'text!tmpl/homepage.html',
        'views/homepage/newpronosview'],
function($, _, Backbone, te, LotofootApi, urls, i18n, tmpl, NewPronosView) {
  
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function() {
			this.user = this.options.user;
			this.alertview = this.options.alertview;
		},
		render : function() {
			var self = this;
			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n,
				urls : urls
			}));

			// Initialize children view
			this.newPronoView = new NewPronosView({
				el : '#newpronos',
				user : this.user,
				alertview : this.alertview
			});

			//Render children view
			this.newPronoView.render();
		},
		/*
		 * Events of the view
		 */
		events : {

		},
		/*
		 * Clean views and objects delegated to this view
		 */
		close : function() {
			this.newPronoView && (this.newPronoView.close ? this.newPronoView.close() : this.newPronoView.undelegateEvents());
			this.undelegateEvents();
		}
	});

	// Our module now returns our view
	return ClassView;
});
