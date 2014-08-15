define(['jquery', 'underscore', 'backbone', 
				'fmk/templateengine', 'fmk/lotofootapi',
				'i18n!tmpl/homepage/nls/pronos', 'text!tmpl/homepage/activetops.html'],
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
			
			LotofootApi.getActiveTops(params, function(msg){
			 
			  _.each(msg.bonus,function(item){
					item.title = i18n['top_' + item.type + '_' + item.season + '_title'];
					item.description = i18n['top_' + item.type + '_' + item.season + '_desc'];
				});
			  
			  $(self.el).html(te.renderTemplate(tmpl, {
	        i18n : i18n,
	        user : self.user.toJSON(),
	        bonus : msg.bonus[0],
	        time : msg.time,
	        teams : {},
	      }));
			}, function(msg){
			  console.log(msg); // TODO : handle errors
			});
		},
		getTeamsForTop : function(bonus){
			
			return bonus;
		},
		/*
		 * Events of the view
		 */
		events : {},
	});

	// Our module now returns our view
	return ClassView;
}); 