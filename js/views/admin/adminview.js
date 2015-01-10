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
			"click #ranking .actions button" : "ranking",
			"change #ranking select" : "cleanRanking"
		},
		ranking : function (e){
			var self = this;
			this.params = {};
			
			_.each(this.$('#ranking select'), function(select){
				self.params[$(select).attr('name')] = $(select).val();
			});
			
			_.each(i18n.seasons, function(season){
				if(season.id == self.params.season){
					self.params.startDate = season.startDate;
					self.params.endDate = season.endDate;
				}
			});
			
			this.pronosvalidation();
		},
		cleanRanking : function(){
			this.$('#ranking i').addClass('hidden');
		},
		/* Ranking */
		pronosvalidation : function(){
			var self = this;
			LotofootApi.pronosValidation(this.params, function(msg){
				self.$('#pronosvalidation i').removeClass('hidden');
				self.pronosscores();
			});
		},
		pronosscores : function(){
			var self = this;
			LotofootApi.pronosScores(this.params, function(msg){
				self.$('#pronosscores i').removeClass('hidden');
				self.createranking();
			});
		},
		createranking : function(){
			var self = this;
			LotofootApi.createRanking(this.params, function(msg){
				self.$('#createranking i').removeClass('hidden');
				self.setrank();
			});
		},
		setrank : function(){
			var self = this;
			LotofootApi.setRank(this.params, function(msg){
				self.$('#setrank i').removeClass('hidden');
			});
		},
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