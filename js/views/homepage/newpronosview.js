define(['jquery', 'underscore', 'backbone', 
				'fmk/templateengine', 'fmk/lotofootapi',
				'i18n!tmpl/homepage/nls/newpronos', 'text!tmpl/homepage/newpronos.html'],
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
			var scoreArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			var params = {userid : this.user.get('userid')};
			
			$.when(LotofootApi.getNewPronos(params), LotofootApi.getPreviousPronos(params))
			.then(function(msg_newpronos,msg_previous){
				var dataNewPronos = self.parseData(msg_newpronos[0]);
				var dataPreviousPronos = self.parseData(msg_previous[0]);
				
				_.each(dataNewPronos.pronos, function(prono){
					prono.teamA = self.teams.getTeams(prono.id_teamA);
					prono.teamB = self.teams.getTeams(prono.id_teamB);
				});
				
				_.each(dataPreviousPronos.games, function(game){
					game.teamA = self.teams.getTeams(game.id_teamA);
					game.teamB = self.teams.getTeams(game.id_teamB);
				});
				
				if (dataNewPronos.pronos.length === 0 && dataPreviousPronos.games.length === 0) {
					$("#newpronos h2").html(i18n.no_pronos);// the div "new pronos" is removed
				} else {
					$(self.el).html(te.renderTemplate(tmpl, {
						i18n : i18n,
						pronos : dataNewPronos.pronos,
						previousPronos : dataPreviousPronos.games,
						score : scoreArray
					}));
				}
			});
		},
		parseData : function(data){
			var jsondata;
			try {// Parse JSON
				jsondata = $.parseJSON(data);
			} catch(err) {
				jsondata = {
					status : 422,
					errorCode : 'JSON',
					error : err,
					data : data
				};
			}

			if (jsondata.status == 200) {
				return jsondata;
			} else {
				this.alertview.displayError(jsondata.status, jsondata.errorCode);
			}
			return {};
		},
		/*
		 * Events of the view
		 */
		events : {
			"click .pronosTable .buttons button" : "actionOnAGame"
		},
		actionOnAGame : function(e) {
			var role = $(e.currentTarget).attr('data-role');
			var ref = $(e.currentTarget).attr('data-ref');
			if (role == "bet") {// User suggests a score for the game
				this.suggestScore(ref);
			}else if (role == "nobet") {// User decides to not bet on this game
				this.refuseGame(ref);
			}else if (role == "update") {// User decides to update his prono
				this.updateProno(ref);
			}
		},
		/*
		 * Action on the buttons bet and no-bet
		 */
		suggestScore : function(ref) {
			var self = this;
			var $rowGame = this.$('.rowGame[ref="' + ref + '"]');
			var scoreA = $rowGame.find('.teamA select').val();
			var scoreB = $rowGame.find('.teamB select').val();

			$rowGame.find('.buttons button').attr('disabled', true);

			LotofootApi.addProno({
				userid : this.user.get('userid'),
				id_game : ref,
				scoreA : scoreA,
				scoreB : scoreB
			}, function(msg) {// success
				self.alertview.displayAlert('success', 'success', i18n.AddProno);
				$rowGame.remove(); // Remove the row
				$rowGame.find('.buttons button').attr('disabled', false);
			}, function(msg) {// error
				self.alertview.displayError(msg.status, msg.errorCode);
				$rowGame.find('.buttons button').attr('disabled', false);
			});
		},
		refuseGame : function(ref) {
			this.$('div[ref="'+ ref +'"]').remove();
		},
		updateProno : function(ref){
			var self = this;
			var $rowProno = this.$('.rowProno[ref="' + ref + '"]');
			var scoreA = $rowProno.find('.teamA select').val();
			var scoreB = $rowProno.find('.teamB select').val();

			$rowProno.find('.buttons button').attr('disabled', true);

			LotofootApi.updateProno({
				userid : this.user.get('userid'),
				id_game : ref,
				scoreA : scoreA,
				scoreB : scoreB
			}, function(msg) {// success
				self.alertview.displayAlert('success', 'success', i18n.updateProno);
				$rowProno.find('.buttons button').attr('disabled', false);
			}, function(msg) {// error
				self.alertview.displayError(msg.status, msg.errorCode);
				$rowProno.find('.buttons button').attr('disabled', false);
			});
		}
	});

	// Our module now returns our view
	return ClassView;
}); 