define(['jquery', 'underscore', 'backbone',
        'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
        'i18n!tmpl/pronos/nls/pronos', 'i18n!nls/country', 'i18n!tmpl/events/nls/worldcup', 'text!tmpl/pronos/toppronos.html'],
function($, _, Backbone, te, LotofootApi, AlertView, urls, i18n, country, worldcup, tmpl)
{
  var ClassView = Backbone.View.extend({
    el : $('#container'),
    initialize : function(options) {
      this.user = options.user;
      this.teams = options.teams;
      this.alertView = new AlertView();
    },
    render : function() {
      var self = this;
      
      LotofootApi.getTopPronos({id_bonus:1},function(msg){ // success
	      
	      $(self.el).html(te.renderTemplate(tmpl, {
	        i18n : i18n,
	        urls : urls,
	        teams : self.getWorldCupTeams(),
	        toppronos : self.getTeamsForTopPronos(msg.pronos)
	      }));
	      
      },function(msg){});
    },
    getTeamsForTopPronos : function(toppronos){
    	var self = this;
    	
    	_.each(toppronos, function(prono){
    		prono.team_first = self.teams.getNationInfos(prono.first);
    		prono.team_second = self.teams.getNationInfos(prono.second);
    		prono.team_third = self.teams.getNationInfos(prono.third);
    		prono.team_fourth = self.teams.getNationInfos(prono.fourth);
    	});
    	
    	return toppronos;
    },
    getWorldCupTeams : function(){
    	var self = this;
    	var teamsId = [];
      var teams = [];
      
      _.each(worldcup.groups, function(group){
        teamsId = _.union(teamsId,group.idTeams);
      });
      
      _.each(teamsId, function(team) {
        if (_.isNumber(team)) {
          teams.push(self.teams.getNationInfos(team));
        }
      });
      
      return _.sortBy(teams, 'name');
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
        this.alertView.displayAlert('warning', 'default', i18n.teams_errorMsg);
        return false;
      }
      
      LotofootApi.betTop({userid : this.user.get('userid'), choices : choices}, function(msg){ // success
        if(msg.errorCode !== undefined){
          self.alertView.displayAlert('warning', 'default', i18n[msg.errorCode]);
        } else {
        	self.render();
          //self.alertView.displayAlert('success', 'success', i18n.success);
        }
        console.log(msg);
      }, function(msg){ // error
        // TODO : handle errors
        console.log(msg);
      });
      console.log(choices);
    }
  });

  // Our module now returns our view
  return ClassView;
}); 