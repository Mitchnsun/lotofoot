define(['jquery', 'jqueryUI', 'underscore', 'backbone',
				'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
				'games/games', 'admin/pickTeamView', 'admin/tablecreategamesview',
				'i18n!nls/admin', 'i18n!nls/country', 'text!admin/creategames.html'],
function($, $UI, _, Backbone,
				te, LotofootApi, urls,
				Games, PickTeamView, TableGamesView,
				i18n, country, tmpl)
{
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.teams = options.teams;
			this.alertview = options.alertview;

			this.games = new Games(); // Collection with the created games
		},
		render : function() {
			var self = this;

			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n.create_games,
				urls : urls
			}));

			this.tableGames = new TableGamesView({
				el : this.$('#newGamesContainer'),
				alertview : this.alertview
			});
			this.pickTeamView = new PickTeamView({
				el : this.$('#pickTeam'),
				user : this.user,
				teams : this.teams
			});

			this.pickTeamView.render();

			this.listenTo(this.pickTeamView, 'add:team', this.addAGame);
		},
		/*
		 * Tools functions
		 */
		addAGame : function(game) {// render the list of games created
			var selectedTeam = [];

			if (game.ready()) {// a game with two teams, add to collection
				this.games.add(game);
				this.pickTeamView.newGame();
				this.pickTeamView.render();
				this.tableGames.setData({
					games : this.games,
					team : selectedTeam
				});
				this.$('div.games').removeClass('hide');
				this.tableGames.render();
			} else {
				selectedTeam.push(game.getFirstSelectedTeam());
			}
		},
		/*
		 * Clean views and objects delegated to this view
		 */
		close : function(){
			this.tableGames && (this.tableGames.close ? this.tableGames.close() : this.tableGames.undelegateEvents());
			this.pickTeamView && (this.pickTeamView.close ? this.pickTeamView.close() : this.pickTeamView.undelegateEvents());
			this.undelegateEvents();
		}
	});

	// Our module now returns our view
	return ClassView;
}); 