define(['jquery', 'underscore', 'backbone'],
function($, _, Backbone) {
    
    var Model = Backbone.Model.extend({
    defaults : {
      teamA : null,
      teamB : null,
      schedule : 0,
      addBy : 0,
      type : null /* variable for the type of the game : league, cup, international, etc. */
    },
    initialize : function(){
      this.set('schedule', Date.now());
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
    }
  });
  // Return the model for the module
  return Model;
}); 