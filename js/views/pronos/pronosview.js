define(['jquery', 'jqueryUI', 'underscore', 'backbone',
				'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
				'collections/games','models/game',
				'i18n!tmpl/pronos/nls/pronos', 'i18n!nls/country', 'text!tmpl/pronos/pronos.html'],
function($, $UI, _, Backbone,	te, LotofootApi, AlertView, urls, Games, Game, i18n, country, tmpl)
{
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.teams = options.teams;
			this.alertView = new AlertView();
			
			this.games = new Games(); // Collection with the games
			
			// Bind functions to the view
      // By default, they bind to the window because they are callback functions
      this.successGetPronosCallback = _.bind(this.successGetPronos, this);
		},
		render : function() {
			LotofootApi.getPronos({}, this.successGetPronosCallback, function(xhr, ajaxOptions, thrownError){
				// TODO
			});
		},
		/**
		 * Get Pronos callback
		 */
		successGetPronos : function(data){
			var self = this;
			_.each(data.games,function(item){
				var game = new Game({addBy : item.addBy});
				item.teamA = self.teams.getTeams(item.id_teamA, item.country);
				item.teamB = self.teams.getTeams(item.id_teamB, item.country);
				game.setData(item);
				self.games.add(game);
			});
			
			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n,
				urls : urls,
				games : this.games.toJSON()
			}));
		},
		/*
		 * Events
		 */
		events : {
			"click .gameWrapper" : "togglePronos"
		},
		togglePronos : function(e){
			if($(e.currentTarget).find('i').length == 0){ // No pronos to display
				return false;
			}
			$(e.currentTarget).next().slideToggle();
		}
	});

	// Our module now returns our view
	return ClassView;
}); 