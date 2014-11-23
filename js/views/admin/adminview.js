/**
 * @author Matthieu Comperat
 */
// Filename: adminview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi',
        'fmk/urls', 'i18n!tmpl/admin/nls/admin', 'text!tmpl/admin/adminpage.html'],
function($, _, Backbone, te, LotofootApi, urls, i18n, tmpl) {
  
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
			this.params = {};
		},
		render : function() {
			var self = this;
			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n,
				urls : urls
			}));
		},
		/*
		 * Events of the view
		 */
		events : {
			"click #ranking .actions button" : "ranking"
		},
		ranking : function (e){
			var self = this;
			this.params = {};
			
			_.each(this.$('#ranking select'), function(select){
				self.params[$(select).attr('name')] = $(select).val();
			});
			
			this.pronosvalidation();
		},
		/* Ranking */
		pronosvalidation : function(){
			var self = this;
			LotofootApi.pronosValidation(this.params, function(msg){
				self.$('#pronosvalidation i').removeClass('hidden');
				console.log(msg, self.params);
				self.pronosscores();
			});
		},
		pronosscores : function(){},
		createranking : function(){},
		setrank : function(){},
		/*
		 * Clean views and objects delegated to this view
		 */
		close : function() {
			//this.activePronosView && (this.activePronosView.close ? this.activePronosView.close() : this.activePronosView.undelegateEvents());
			this.undelegateEvents();
		}
	});

	// Our module now returns our view
	return ClassView;
});