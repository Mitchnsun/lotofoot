/**
 * @author Matthieu Compérat
 */
define(['jquery', 'jqueryUI', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'i18n!nls/admin', 'text!admin/tablecreategames.html'],
function($, $UI, _, Backbone, te, LotofootApi, i18n, tmpl) {

  var ClassView = Backbone.View.extend({
    initialize : function(options) {
      this.el = options.el;
      this.alertview = options.alertview;
      this.selectedTeam = [];
    },
    render : function() {
      $(this.el).html(te.renderTemplate(tmpl, {
        i18n : i18n.create_games,
        games : this.games.toJSON(),
        hours : i18n.create_games.hours,
        minutes : i18n.create_games.minutes
      }));

      this.$('input.schedule').datepicker({
        dateFormat : "dd/mm/yy"
      });
    },
    setData : function(params) {
      this.games = params.games;
      this.selectedTeam = params.team;
    },
    buildStage : function(id, competition) {
      var stages = i18n.create_games["stage_" + competition];
      var container = this.$('#' + id).find('.selectStage');
      var input = $(container).find('select');
      var elts = "<select data-ref='" + id + "' class='input-small'>";
      var selectedStage = $(input).val() ? $(input).val() : undefined;
      
      _.each(stages, function(stage, inc) {
        if (selectedStage === stage) {
          elts += '<option value="' + stage + '" selected="selected">' + stage + '</option>';
        } else {
          elts += '<option value="' + stage + '">' + stage + '</option>';
        }
      });
      elts += "</select>";

      $(container).html(elts);

      return selectedStage;
    },
    /*
     * Events of the view
     */
    events : {
      "change input.schedule, select" : "updateSchedule",
      "click button.remove-prono" : "removeProno",
      "submit form" : "addGames"
    },
    updateSchedule : function(e) {
      var id = this.$(e.currentTarget).attr('data-ref');
      var game = this.games.get(id);

      var inputDate = this.$('#' + id).find('input.schedule');
      game.set('date', $(inputDate).val());

      var inputTime = this.$('#' + id).find('select');
      game.set('hour', $(inputTime[0]).val());
      game.set('minute', $(inputTime[1]).val());
      game.set('competition', $(inputTime[2]).val());
      game.set('stage', this.buildStage(id, $(inputTime[2]).val()));
      this.delegateEvents();
    },
    removeProno : function(e) {
      var role = $(e.currentTarget).attr('data-role');
      var id = $(e.currentTarget).attr('data-ref');
      var game = this.games.get(id);

      if (role == 'remove') {// remove tr element linked to this
        $('#' + id).remove();
        this.games.remove(game);
      }
    },
    addGames : function(e) {
      e.preventDefault();
      var self = this;
      var ready = true;

      if (this.$('form tr').length === 0) {
        ready = false;
        this.alertview.displayAlert('warning', 'default', i18n.create_games.empty_games);
        return false;
      }

      this.$('input.schedule').each(function(index) {
        if ($(this).val() === '') {
          ready = false;
        }
      });

      if (ready) {
        this.$('input:submit').attr('disabled', true);
        LotofootApi.createGames({
          games : this.games.toJSON()
        }, function() {/* Success */
          self.$('input:submit').removeAttr("disabled");
          self.games.reset();
          $('#newGamesContainer').addClass('hide');
          self.alertview.displayAlert('success', 'success', i18n.create_games.add_success);
        }, function() {/* Error */
          self.$('input:submit').removeAttr("disabled");
        });
      } else {
        this.alertview.displayAlert('warning', 'default', i18n.create_games.wrong_schedule);
      }
    }
  });

  // Our module now returns our view
  return ClassView;
}); 