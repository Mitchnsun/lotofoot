define(['jquery', 'underscore', 'backbone', 'fmk/templateengine',
				'i18n!tmpl/ranking/nls/ranking', 'text!tmpl/ranking/ranking.html'],
function($, _, Backbone, te, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
			this.ranking = options.ranking;
			this.type = options.type;
			this.season = options.season;
		},
		render : function() {
			var self = this;
			
			if(this.type && this.season){
			  this.ranking.load({
			    type : this.type,
			    season : this.season
			  });
			} else if (!this.ranking.default_value){
			  this.ranking.load();
			}
			
      $.when(this.ranking.promise).done(function() {
        $(self.el).html(te.renderTemplate(tmpl, {
          i18n : i18n,
          title : self.setTitle(),
          ranking : self.ranking.toJSON()
        }));
      });
		},
		setTitle : function(){
		  var title = i18n.title;
		  
		  if(this.type && this.season){
		    title = i18n['title_' + this.type + '_' + this.season];
		  }
		  
		  return title;
		}
	});

	// Our module now returns our view
	return ClassView;
}); 