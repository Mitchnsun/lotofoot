// Filename: homepageview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi',
        'fmk/urls', 'i18n!tmpl/nls/homepage', 'text!tmpl/homepage.html',
        'views/homepage/activepronosview', 'views/homepage/activetopsview'],
function($, _, Backbone, te, LotofootApi, urls, i18n, tmpl, ActivePronosView, ActiveTopsView) {
  
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
			this.teams = options.teams;
			this.ranking = options.ranking;
		},
		render : function() {
			var self = this;
			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n,
				urls : urls
			}));

			// Initialize children views
			this.activePronosView = new ActivePronosView({
				el : '#activepronos',
				user : this.user,
				alertview : this.alertview,
				teams : this.teams
			});
			
			this.activeTopsView = new ActiveTopsView({
				el : '#activepronos',
				user : this.user,
				alertview : this.alertview,
				teams : this.teams
			});

			//Render children view
			this.activePronosView.render();
			this.activeTopsView.render();
		},
		/*
		 * Events of the view
		 */
		events : {},
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
