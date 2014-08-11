define(['jquery', 'underscore', 'backbone', 
				'fmk/templateengine', 'fmk/lotofootapi',
				'i18n!tmpl/homepage/nls/pronos', 'text!tmpl/homepage/activepronos.html'],
function($, _, Backbone, te, LotofootApi, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		initialize : function(options) {
			this.user = options.user;
			this.el = options.el;
			this.alertview = options.alertview;
			this.teams = options.teams;
		},
		render : function() {
			var self = this;
			var params = {userid : this.user.get('userid')};
			
			LotofootApi.getActivePronos(params, function(msg){
			  _.each(msg.games, function(game){
          game.teamA = self.teams.getTeams(game.id_teamA);
          game.teamB = self.teams.getTeams(game.id_teamB);
        });
        
			  if (msg.games.length === 0) {
          $("#activepronos h2").html(i18n.no_pronos);
        } else {
          $(self.el).html(te.renderTemplate(tmpl, {
            i18n : i18n,
            pronos : msg.games,
            score : _.range(10)
          }));
        }
			}, function(msg){
			  console.log(msg); // TODO : handle errors
			});
		},
		/*
		 * Events of the view
		 */
		events : {
			"click .pronosTable .buttons button" : "suggestScore",
			'change select.selectScore' : 'enablePlayoffWinner',
			'click .teamsContainer.active label' : 'selectWinner'
		},
		/*
		 * Select a winner after overtime
		 */
		enablePlayoffWinner : function(e){
			var self = this;
			var teamsContainer = this.$(e.currentTarget).parent().parent();
			var scoreA = 'A';
			var scoreB = 'B';
			
			_.each(teamsContainer.find('select'), function(select){
				var $select = self.$(select);
				if($select.attr('ref') == 'A'){
					scoreA = $select.val();
				} else if ($select.attr('ref') == 'B'){
					scoreB = $select.val();
				}
			});
			
			if (scoreA != scoreB){
				teamsContainer.removeClass('active');
				var winner = teamsContainer.find('.winner');
				this.$(winner).removeClass('winner');
			} else {
				// Same score, enable the choice for the winner
				teamsContainer.addClass('active');
			}
		},
		selectWinner : function(e){
			e.preventDefault();
			var teamsContainer = this.$(e.currentTarget).parent().parent();
			var $parentElement = this.$(e.currentTarget).parent();
			
			if ($parentElement.hasClass('winner')){
				$parentElement.removeClass('winner');
			} else {
				var span = this.$(teamsContainer).find('.span4');
				this.$(span).removeClass('winner');
				$parentElement.addClass('winner');
			}
		},
		getWinner : function($rowGame){
      var winner = $rowGame.find('.winner');
      
      if(winner.length > 0){
        return this.$(winner).attr('ref');
      } else {
        return '';
      }
    },
		/*
		 * Action on the buttons bet and no-bet
		 */
		suggestScore : function(e) {
			var self = this;
			var ref = $(e.currentTarget).attr('data-ref');
			var $rowGame = this.$('.rowGame[ref="' + ref + '"]');
			var scoreA = $rowGame.find('.teamA select').val();
			var scoreB = $rowGame.find('.teamB select').val();

			$rowGame.find('.buttons button').attr('disabled', true);

			LotofootApi.betProno({
				userid : this.user.get('userid'),
				id_game : ref,
				scoreA : scoreA,
				scoreB : scoreB,
				winner : this.getWinner($rowGame)
			}, function(msg) {// success
				self.alertview.displayAlert('success', 'success', i18n.AddProno);
				$rowGame.find('.buttons button').attr('disabled', false);
				if (self.$('.rowGame').length == 0){
					self.render();
				}
			}, function(msg) {// error
				self.alertview.displayError(msg.status, msg.errorCode);
				$rowGame.find('.buttons button').attr('disabled', false);
			});
		}
	});

	// Our module now returns our view
	return ClassView;
}); 