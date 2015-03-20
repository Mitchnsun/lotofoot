define(['jquery', 'underscore', 'backbone', 
				'fmk/templateengine', 'fmk/lotofootapi',
				'i18n!nls/wordings', 'text!homepage/activetops.html'],
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
			  
			  if(msg.bonus.length > 0){
			  	$(self.el).html(te.renderTemplate(tmpl, {
		        i18n : i18n.homepage,
		        user : self.user.toJSON(),
		        bonus : self.getDatas(msg.bonus),
		        time : msg.time,
		        teams : {}
		      }));
					
					self.selectedTops(msg.bonus);
			  } else{
			  	self.close();
			  }
			}, function(msg){
			  console.log(msg); // TODO : handle errors
			});
		},
		getDatas : function(bonus){
			var self = this;
			
			_.each(bonus, function(item){
				item.title = self.setTitle(item);
				item.description = i18n.homepage['top_' + item.type + '_' + item.season + '_desc'];
				item.teams = self.teams.getTeamsForTops(item.type, item.table_link);
			});
			
			return bonus;
		},
		// Fetch title for the bonus with his type and season
    setTitle : function(bonus){
    	var title = "";
    	
    	title += i18n.homepage["top_" + bonus.type];
    	
    	var year = i18n.homepage.LotofootStartingYear + parseInt(bonus.season);
    	
    	if(bonus.type == "WC"){
    		title += " " + year;
    	} else {
    		title += " " + (year-1) + '/' + year;
    	}
    	
    	title += " - " + i18n.homepage.top + " " + bonus.top;
    	
    	return title;
    },
		selectedTops : function(bonus){
			var self = this;
			
			_.each(bonus, function(item){
				if(item.prono){
					self.$('#bonus' + item.id_bonus + " select.firstTeam").val(item.prono.first);
					self.$('#bonus' + item.id_bonus + " select.secondTeam").val(item.prono.second);
					self.$('#bonus' + item.id_bonus + " select.thirdTeam").val(item.prono.third);
					self.$('#bonus' + item.id_bonus + " select.fourthTeam").val(item.prono.fourth);
					self.$('#bonus' + item.id_bonus + " select.fifthTeam").val(item.prono.fifth);
				}
			});
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
        this.alertview.displayAlert('warning', 'default', i18n.homepage[msg.errorCode]);
      } else {
      	this.alertview.displayAlert('success', 'success', i18n.homepage.AddProno);
      }
		},
		/*
		 * Clean views and objects delegated to this view
		 */
		close : function() {
			$('#activetops').remove();
			this.undelegateEvents();
		}
	});

	// Our module now returns our view
	return ClassView;
}); 