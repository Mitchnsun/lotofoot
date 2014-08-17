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
			
			// Bind functions to the view
      // By default, they bind to the window because they are callback functions
      this.successsuggestATopCallback = _.bind(this.topSuggested, this);
		},
		render : function() {
			var self = this;
			var params = {userid : this.user.get('userid')};
			
			LotofootApi.getActiveTops(params, function(msg){
			  
			  $(self.el).html(te.renderTemplate(tmpl, {
	        i18n : i18n,
	        user : self.user.toJSON(),
	        bonus : self.getDatas(msg.bonus),
	        time : msg.time,
	        teams : {},
	      }));

			}, function(msg){
			  console.log(msg); // TODO : handle errors
			});
		},
		getDatas : function(bonus){
			var self = this;
			
			_.each(bonus, function(item){
				item.title = i18n['top_' + item.type + '_' + item.season + '_title'];
				item.description = i18n['top_' + item.type + '_' + item.season + '_desc'];
				item.teams = self.teams.getTeamsForTops(item.type, item.table_link);
			});
			
			return bonus;
		},
		/*
		 * Events of the view
		 */
		events : {
			'submit form' : 'suggestATop'
		},
		suggestATop : function(e){
			e.preventDefault();
			
			var self = this;
			var params = {
				id : this.$(e.currentTarget).attr('ref'),
				userid : this.user.get('userid'),
				choices : {}
			};
			
			_.each(this.$(e.currentTarget).find('select'), function(select){
				params.choices[$(select).attr('name')] = $(select).val()?$(select).val():undefined;
			});
			
			LotofootApi.betTop(params, this.successsuggestATopCallback, function(msg){ // errors
				console.log(msg); // TODO : handle errors
				self.alertview.displayError(msg.status, msg.errorCode);
			});
		},
		topSuggested : function(msg){
			if(msg.errorCode !== undefined){
        this.alertview.displayAlert('warning', 'default', i18n[msg.errorCode]);
      } else {
      	this.alertview.displayAlert('success', 'success', i18n.AddProno);
      }
		}
	});

	// Our module now returns our view
	return ClassView;
}); 