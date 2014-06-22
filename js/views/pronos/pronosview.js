define(['jquery', 'jqueryUI', 'underscore', 'backbone',
				'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
				'collections/games','models/game', 'views/pronos/topview',
				'i18n!tmpl/pronos/nls/pronos', 'i18n!nls/country', 'text!tmpl/pronos/pronos.html'],
function($, $UI, _, Backbone,	te, LotofootApi, AlertView, urls, Games, Game, TopView, i18n, country, tmpl)
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
			
			this.topview = new TopView({
				user : this.user,
	      teams : this.teams,
	      el : '#toppronos'
			});
			
			this.topview.render();
		},
		/*
		 * Events
		 */
		events : {
			"click .gameWrapper" : "togglePronos",
			"click .nav a" : "pronosnav"
		},
		togglePronos : function(e){
			if($(e.currentTarget).find('i').length == 0){ // No pronos to display
				return false;
			}
			$(e.currentTarget).next().slideToggle();
		},
		pronosnav : function(e){
			e.preventDefault();
			this.$('ul li.active').removeClass('active');
			this.$(e.currentTarget).parent().addClass('active');
			this.$('.pronopanel').hide();
			
			var id = this.$(e.currentTarget).attr('ref');
			this.$(id).show();
		}
	});

	// Our module now returns our view
	return ClassView;
}); 