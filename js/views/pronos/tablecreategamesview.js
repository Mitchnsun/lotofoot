/**
 * @author Matthieu Compérat
 */
define(['jquery', 'jqueryUI', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/alertview', 'fmk/lotofootapi',
        'i18n!tmpl/pronos/nls/creategames', 'text!tmpl/pronos/tablecreategames.html'],
function($, $UI, _, Backbone, te, AlertView, LotofootApi, i18n, tmpl) {
    
  var ClassView = Backbone.View.extend({
    initialize : function(){
      this.el = this.options.el;
      this.games = [];
      this.selectedTeam = [];
      this.alertView = new AlertView();
    },
    render : function() {
      $(this.el).html(te.renderTemplate(tmpl, {
        i18n : i18n,
        games : this.games.toJSON(),
        hours : i18n.hours,
        minutes : i18n.minutes
      }));
      
      this.$('input.schedule').datepicker({
        dateFormat : "dd/mm/yy"
      }); 
    },
    setData : function(params){
      this.games = params.games;
      this.selectedTeam = params.team;
    },
    /*
     * Events of the view
     */
    events : {
      "change input.schedule, select" : "updateSchedule",
      "click button.remove-prono" : "removeProno",
      "submit form" : "addGames"
    },
    updateSchedule : function(e){
    	var id = this.$(e.currentTarget).attr('data-ref');
    	var game = this.games.get(id);
    	
    	var inputDate = this.$('#'+id).find('input.schedule');
    	game.set('date', $(inputDate).val());
    	
    	var inputTime = this.$('#'+id).find('select');
    	game.set('hour', $(inputTime[0]).val());
    	game.set('minute', $(inputTime[1]).val());
    },
    removeProno : function(e) {
      var role = $(e.currentTarget).attr('data-role');
			var id = $(e.currentTarget).attr('data-ref');
			var game = this.games.get(id);
			
      if (role == 'remove') {// remove tr element linked to this
        $('#'+id).remove();
        this.games.remove(game);
      }
    },
    addGames : function(e){
      e.preventDefault();
      var ready = true;
      
      if(this.$('form tr').length == 0){
      	ready = false;
      	this.alertView.displayAlert('warning','default', i18n.empty_games);
      	return false;
      }
      
      this.$('input.schedule').each(function(index){
      	if($(this).val() == ''){
      		ready = false;
      	}
      });
      
      if(ready){
      	LotofootApi.createGames({games : this.games.toJSON()}, function(){}, function(){});
      }else {
      	this.alertView.displayAlert('warning','default', i18n.wrong_schedule);
      }
      
    }
  });
  
  // Our module now returns our view
  return ClassView;
});