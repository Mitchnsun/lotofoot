define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
				'i18n!nls/wordings', 'text!rankings/ranking.html'],
function($, _, Backbone, te, LotofootApi, urls, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
			this.ranking = options.ranking;
			this.type = options.params.type;
			this.season = options.params.season;
			this.rankingsList = [];
			
			// Bind functions to the view
      // By default, they bind to the window because they are callback functions
			this.getRankingsListSuccess = _.bind(this.rankingsListProcess, this);
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
          i18n : i18n.rankings,
          ranking : self.ranking.toJSON(),
          rankings : self.rankingsList
        }));
      });
		},
		getRankingsList : function(){
			var self = this;
			return LotofootApi.getRankingsList({}, this.getRankingsListSuccess, function(msg) {// error
        console.log(msg); // TODO : manage errors
      });
		},
		rankingsListProcess : function(msg){
			var self = this;
			this.rankingsList = msg.rankings;
			
			_.each(this.rankingsList, function(item){
				item.title = self.setTitle(item);
				if(self.type == item.type && self.season == item.season){
					item.active = true;
				}
			});
		},
		setTitle : function(item){
		  var title = i18n.rankings.title;
		  
		  if(i18n.rankings[item.type]){
		  	title = i18n.rankings[item.type];
		  }else if(item.type && item.season){
		    title = i18n.rankings.season + " " + i18n.rankings.seasons[item.season] + " - " + i18n.rankings.types[item.type];
		  }
		  
		  return title;
		},
		/*
		 * Events of the view
		 */
		events : {
			"click ul.dropdown-menu a" : "selectRanking"
		},
		selectRanking : function(e){
			e.preventDefault();
			this.type = $(e.currentTarget).attr('data-type');
			this.season = $(e.currentTarget).attr('data-season');
			history.replaceState({}, '', '#' + urls.RANKING.hash + '/' + this.type + '/s' + this.season);
			this.render();
		},
		/*
		 * Clean views and objects delegated to this view
		 */
		close : function() {
			this.undelegateEvents();
		}
	});

	// Our module now returns our view
	return ClassView;
}); 