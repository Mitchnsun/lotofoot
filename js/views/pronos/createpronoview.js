define(['jquery', 'jqueryUI', 'underscore', 'backbone',
				'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
				'collections/games', 'views/teams/pickTeamView', 'views/pronos/tablecreatepronosview',
				'i18n!tmpl/pronos/nls/createprono', 'i18n!nls/country', 'text!tmpl/pronos/createprono.html'],
function($, $UI, _, Backbone,
				te, LotofootApi, AlertView, urls,
				Games, PickTeamView, TablePronosView,
				i18n, country, tmpl)
{
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function() {
			this.user = this.options.user;
			this.teams = this.options.teams;
			this.alertView = new AlertView();

			this.games = new Games();
			// Collection with the created games
		},
		render : function() {
			var self = this;

			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n,
				urls : urls
			}));

			this.tablePronos = new TablePronosView({
				el : this.$('#newPronosContainer')
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
			} else {
				selectedTeam.push(game.getFirstSelectedTeam());
			}

			this.tablePronos.setData({
				games : this.games,
				team : selectedTeam
			});
			this.$('div.games').removeClass('hide');
			this.tablePronos.render();

			return;
			// Update the game with the team (1 or 2)
			// Select the last td in the last tr (game created)
			var $tr = this.$('div.games tr').last();
			$tr.find('td').last().html(game);
			$tr.removeClass('hide');
			$tr.attr('ref', index);
			$tr.find('.schedule').datepicker({
				dateFormat : "dd-mm-yy"
			});

		}
	});

	// Our module now returns our view
	return ClassView;
}); 