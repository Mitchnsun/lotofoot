// Filename: currentgamesview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi',
        'fmk/urls', 'i18n!nls/wordings', 'text!homepage/currentgames.html'],
function($, _, Backbone, te, LotofootApi, urls, i18n, tmpl) {
  
	var ClassView = Backbone.View.extend({
		initialize : function(options) {
			this.user = options.user;
			this.el = options.el;
			this.teams = options.teams;
		},
		render : function() {
			var self = this;
			
			LotofootApi.getCurrentGames({},function(msg){
				_.each(msg, function(game){
					game.teamA = self.teams.getNationWithFIFACode(game.home_team.code);
					game.teamA.goals = game.home_team.goals;
					game.teamB = self.teams.getNationWithFIFACode(game.away_team.code);
					game.teamB.goals = game.away_team.goals;
				});
				
				$(self.el).prepend(te.renderTemplate(tmpl, {
					i18n : i18n.homepage,
					urls : urls,
					games : msg
				}));
				
			}, function(msg){/* Do not display widget if errors */});
		}
	});

	// Our module now returns our view
	return ClassView;
});