define(['jquery', 'jqueryUI', 'underscore', 'backbone',
				'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
				'collections/games', 'views/teams/pickTeamView', 'views/pronos/tablecreategamesview',
				'i18n!tmpl/pronos/nls/creategames', 'i18n!nls/country', 'text!tmpl/pronos/creategames.html'],
function($, $UI, _, Backbone,
				te, LotofootApi, AlertView, urls,
				Games, PickTeamView, TableGamesView,
				i18n, country, tmpl)
{
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function() {
			this.user = this.options.user;
			this.teams = this.options.teams;
			this.alertView = new AlertView();

			this.games = new Games(); // Collection with the created games
		},
		render : function() {
			var self = this;

			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n,
				urls : urls
			}));

			this.tableGames = new TableGamesView({
				el : this.$('#newGamesContainer')
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
		}
	});

	// Our module now returns our view
	return ClassView;
}); 