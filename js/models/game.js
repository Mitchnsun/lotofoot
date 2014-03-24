define(['jquery', 'underscore', 'backbone'],
function($, _, Backbone) {
    
    var Model = Backbone.Model.extend({
    defaults : {
    	id : null,
      teamA : null,
      teamB : null,
      date : '',
      hour : '',
      minute : '',
      addBy : 0,
      addedAt : 0,
      type : null, /* variable for the type of the game : league, cup, international, etc. */
    	country : '', /* empty if an international game */
    	pronos : {}, /* collection */
    },
    /* Functions to create a game */
    initialize : function(){
      this.set('addedAt', Date.now());
      this.set('id', this.cid);
    },
    ready : function(){ // Check if the two teams
      if ((this.get('teamA') && this.get('teamB')) != null) {
        return true;
      } else{
        return false;
      }
    },
    addTeam : function(team){
      if(!this.ready() && this.get('teamA') == null){
        this.set('teamA', team);
      }else if (!this.ready() && this.get('teamB') == null){
        this.set('teamB', team);
      }
    },
    getFirstSelectedTeam : function(){
      if(this.ready()){
        return false;
      }
      
      var teamA = this.get('teamA');
      var teamB = this.get('teamB');
      
      if(teamA != null && teamB == null){
        return teamA.name;
      }else if(teamB != null && teamA == null){
        return teamB.name;
      }
      
      return null;
    },
    /* Functions for pronos display */
  });
  // Return the model for the module
  return Model;
}); 