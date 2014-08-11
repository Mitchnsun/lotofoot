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
			  console.log(msg);
			}, function(msg){
			  console.log(msg); // TODO : handle errors
			});
		},
		/*
		 * Events of the view
		 */
		events : {},
	});

	// Our module now returns our view
	return ClassView;
}); 