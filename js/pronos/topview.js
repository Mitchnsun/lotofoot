define(['jquery', 'underscore', 'backbone',
        'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
        'i18n!nls/wordings', 'i18n!nls/country', 'text!pronos/toppronos.html'],
function($, _, Backbone, te, LotofootApi, AlertView, urls, i18n, country, tmpl)
{
  var ClassView = Backbone.View.extend({
    el : $('#container'),
    initialize : function(options) {
      this.user = options.user;
      this.teams = options.teams;
      this.el = options.el !== undefined? options.el:this.el;
      this.alertView = new AlertView();
    },
    render : function() {
      var self = this;
      
      LotofootApi.getTopPronos({},function(msg){ // success
      	
      	_.each(msg.bonus, function(bonus){
      		self.setTitle(bonus);
      	});

	      $(self.el).html(te.renderTemplate(tmpl, {
	        i18n : i18n,
	        urls : urls,
	        user : self.user.toJSON(),
	        bonus : self.getTeamsForTopPronos(msg.bonus),
	        time : msg.time
	      }));
	      
      },function(msg){});
    },
    getTeamsForTopPronos : function(toppronos){
    	var self = this;
    	
    	_.each(toppronos, function(prono){
    		prono.team_first = self.teams.getTeams(prono.first);
    		prono.team_second = self.teams.getTeams(prono.second);
    		prono.team_third = self.teams.getTeams(prono.third);
    		prono.team_fourth = self.teams.getTeams(prono.fourth);
    		prono.team_fifth = self.teams.getTeams(prono.fifth);
    		
    		self.getTeamsForTopPronos(prono.pronos);
    	});
    	
    	return toppronos;
    },
    // Fetch title for the bonus with his type and season
    setTitle : function(bonus){
    	var title = "";
    	
    	title += i18n.tops["top_" + bonus.type];
    	
    	var year = i18n.LotofootStartingYear + parseInt(bonus.season);
    	
    	if(bonus.table_link == "international"){
    		title += " " + year;
    	} else {
    		title += " " + (year-1) + '/' + year;
    	}
    	
    	title += " - " + i18n.tops.top + " " + bonus.top;
    	
    	bonus.title = title;
    },
    /*
     * Events
     */
    events : {
      "submit" : "betTop"
    },
    betTop : function(e){
      e.preventDefault();
      var self = this;
      var choices = {};
      var error = false;
      
      _.each(this.$('form select'), function(choice){
        if($(choice).val() == ""){
          error = true;
          $(choice).parent().parent().addClass('error');
        }
        choices[$(choice).attr('name')] = $(choice).val();
      });
      
      if(error){
        this.alertView.displayAlert('warning', 'default', i18n.pronos.teams_errorMsg);
        return false;
      }
      
      LotofootApi.betTop({userid : this.user.get('userid'), choices : choices}, function(msg){ // success
        if(msg.errorCode !== undefined){
          self.alertView.displayAlert('warning', 'default', i18n.pronos[msg.errorCode]);
        } else {
        	self.render();
          //self.alertView.displayAlert('success', 'success', i18n.success);
        }
        console.log(msg);
      }, function(msg){ // error
        // TODO : handle errors
        console.log(msg);
      });
    }
  });

  // Our module now returns our view
  return ClassView;
}); 