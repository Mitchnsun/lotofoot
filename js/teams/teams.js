define(['jquery', 'underscore', 'backbone', 'fmk/lotofootapi', 'i18n!nls/country', 'teams/team'],
function($, _, Backbone, LotofootApi, country, Team) {

  var Model = Backbone.Collection.extend({
		model : Team,
    initialize : function() {
      // Bind functions to the view
      // By default, they bind to the window because they are callback functions
      this.successGetTeamsCallback = _.bind(this.successGetTeams, this);

      return this.promise = LotofootApi.getTeams({}, this.successGetTeamsCallback, function(msg) {// error
        console.log(msg); // TODO : manage errors
      });
    },
    /*
     * Success of getTeams WS
     */
    successGetTeams : function(msg) {
    	var self = this;

      _.each(msg.teams, function(team) {// add teams to collections
      	if(team.type == "international"){
      		team.name = country[team.country].name;
        	team.fifa_code = country[team.country].fifa_code;
      	}
        	team.country = country[team.country].name;
        	self.add(team);
      });
    },
    /*
     * Get the information of a teams
     */
    getNationWithFIFACode : function(fifa_code){
    	var nation = this.findWhere({fifa_code : fifa_code});
      
      if(nation){
      	return nation.toJSON();
      }

      return {};
    },
    getTeams : function(id) {// return the all the infos of the team in an object
      var team = this.findWhere({id : id});
      
      if(team){
      	return team.toJSON();
      }

      return {};
    },
    getClubs : function(){
    	var clubs = [];
    	_.each(this.where({"type" : "club"}), function(item){
    		clubs.push(item.toJSON());
    	});
    	return clubs;
    },
    getNations : function(){
    	var nations = [];
    	_.each(this.where({"type" : "international"}), function(item){
    		nations.push(item.toJSON());
    	});
    	return nations;
    },
    getTeamsForTops : function(type, link){
    	var teams = [];
    	_.each(this.where({"league" : link}), function(team){
    		teams.push(team.toJSON());
    	});
    	return teams;
    }
  });

  // Return the model for the module
  return Model;
});
