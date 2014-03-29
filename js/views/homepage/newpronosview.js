define(['jquery', 'underscore', 'backbone', 
				'fmk/templateengine', 'fmk/lotofootapi',
				'i18n!tmpl/homepage/nls/newpronos', 'text!tmpl/homepage/newpronos.html'],
function($, _, Backbone, te, LotofootApi, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		initialize : function() {
			this.user = this.options.user;
			this.el = this.options.el;
			this.alertview = this.options.alertview;
		},
		render : function() {
			var self = this;

			LotofootApi.getNewPronos({
				userid : this.user.get('userid')
			}, function(msg) {// success
				if (msg.pronos.length > 0) {
					$(self.el).html(te.renderTemplate(tmpl, {
						i18n : i18n,
						pronos : msg.pronos
					}));
				} else {
					$(self.el).remove();
					// the div "new pronos" is removed
				}
			}, function(msg) {// error
				self.alertview.displayError(msg.status, msg.errorCode);
			});
		},
		/*
		 * Events of the view
		 */
		events : {
			"click td.buttons button" : "actionOnAGame"
		},
		actionOnAGame : function(e) {
			var role = $(e.currentTarget).attr('data-role');
			var ref = $(e.currentTarget).attr('data-ref');
			if (role == "bet") {// User suggests a score for the game
				this.suggestScore(ref);
			}
			if (role == "nobet") {// User decides to not bet on this game
				this.refuseGame(ref);
			}
		},
		/*
		 * Action on the buttons bet and no-bet
		 */
		suggestScore : function(ref) {
			var self = this;
			var $rowGame = this.$('.rowGame[ref="' + ref + '"]');
			var scoreA = $rowGame.find('.scoreA select').val();
			var scoreB = $rowGame.find('.scoreB select').val();

			$rowGame.find('.buttons button').attr('disabled', true);

			LotofootApi.addProno({
				userid : this.user.get('userid'),
				id_game : ref,
				scoreA : scoreA,
				scoreB : scoreB
			}, function(msg) {// success
				self.alertview.displayAlert('success', 'success', i18n.AddProno);
				$rowGame.remove();
				// Remove the row
				$rowGame.find('.buttons button').attr('disabled', false);
			}, function(msg) {// error
				self.alertview.displayError(msg.status, msg.errorCode);
				$rowGame.find('.buttons button').attr('disabled', false);
			});
		},
		refuseGame : function(ref) {
			console.log('Refuse Game : ' + ref);
		},
	});

	// Our module now returns our view
	return ClassView;
}); 