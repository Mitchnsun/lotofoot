define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
				'i18n!tmpl/events/nls/worldcup', 'text!tmpl/events/worldcup.html'],
function($, _, Backbone, te, LotofootApi, urls, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
			this.teams = options.teams;
			this.ranking = options.ranking;
		},
		render : function() {
			var self = this;
			
			// Get teams infos
			_.each(i18n.groups, function(group){
				var teams = []
				_.each(group.teams,function(team){
					teams.push(self.teams.getNationInfos(team));
				});
				group.teams = teams;
			});
			
			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n,
				urls : urls
			}));
		},
		/*
		 * Events of the view
		 */
		events : {
		  'click .panel-footer' : 'enlargeGroup'
		},
		enlargeGroup : function(e){
		  var $target = this.$(e.currentTarget);
		  this.$("#worldcup .group").removeClass('active');
		  $target.parent().parent().addClass('active');
		}
	});

	// Our module now returns our view
	return ClassView;
});