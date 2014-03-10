/**
 * @author Matthieu Compérat
 */
define(['jquery', 'jqueryUI', 'underscore', 'backbone', 'fmk/templateengine',
        'i18n!tmpl/pronos/nls/createprono', 'text!tmpl/pronos/tablecreatepronos.html'],
function($, $UI, _, Backbone, te, i18n, tmpl) {
    
  var ClassView = Backbone.View.extend({
    initialize : function(){
      this.el = this.options.el;
      this.games = [];
      this.selectedTeam = [];
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
    /*
     * Events of the view
     */
    events : {
      "change input.schedule" : "updateSchedule",
      "click button.remove-prono" : "removeProno",
      "submit form" : "addPronos"
    },
    updateSchedule : function(e){
      console.log(_.indexOf(this.$('input.schedule'),this.$(e.currentTarget)),this.$('input.schedule'),this.$(e.currentTarget));
    },
    removeProno : function(e) {
      var role = $(e.currentTarget).attr('data-role');

      if (role == 'remove') {// remove tr element linked to this
        $(e.currentTarget).parent().parent().remove();
      }
    },
    addPronos : function(e){
      e.preventDefault();
      console.log(this.$('form').serializeArray());
    },
    setData : function(params){
      this.games = params.games;
      this.selectedTeam = params.team;
      console.log(this.games.toJSON(),this.selectedTeam);
    }
  });
  
  // Our module now returns our view
  return ClassView;
});