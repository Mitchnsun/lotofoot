define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi',
				'i18n!tmpl/ranking/nls/ranking', 'text!tmpl/ranking/ranking.html'],
function($, _, Backbone, te, LotofootApi, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
			this.ranking = options.ranking;
			this.type = options.type;
			this.season = options.season;
			this.rankingList = [];
		},
		render : function() {
			var self = this;
			
			if(!this.type || !this.season){
				this.type = this.ranking.default_type;
				this.season = this.ranking.default_season; 
			}
			
			this.ranking.load({
		    type : this.type,
		    season : this.season
		  });
			
      $.when(this.ranking.promise, self.getRankingsList()).done(function() {
        $(self.el).html(te.renderTemplate(tmpl, {
          i18n : i18n,
          title : self.setTitle(),
          ranking : self.ranking.toJSON()
        }));
      });
		},
		setTitle : function(){
		  var title = i18n.title;
		  
		  if(i18n[this.type]){
		  	return i18n[this.type];
		  }
		  
		  if(this.type && this.season){
		    title = i18n.season + " " + i18n.seasons[this.season] + " - " + i18n.types[this.type];
		  }
		  
		  return title;
		},
		getRankingsList : function(){
			var self = this;
			return LotofootApi.getRankingsList({}, function(msg){
				self.rankingList = msg.rankings;
			});
		}
	});

	// Our module now returns our view
	return ClassView;
}); 