define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
        'collections/games', 'models/game', 'i18n!tmpl/events/nls/worldcup', 'text!tmpl/events/worldcup.html'],
function($, _, Backbone, te, LotofootApi, urls, Games, Game, i18n, tmpl) {

  var ClassView = Backbone.View.extend({
    el : $('#container'),
    initialize : function(options) {
      this.user = options.user;
      this.alertview = options.alertview;
      this.teams = options.teams;
      this.ranking = options.ranking;
      
      this.groupsGames = new Games(); // Collection with the games for groups stage
      this.secondStageGames = new Games(); // Collection with the games after the groups
    },
    render : function() {
      var self = this;

      // Get teams infos
      _.each(i18n.groups, function(group) {
        var teams = []
        _.each(group.idTeams, function(team) {
          if (_.isNumber(team)) {
            teams.push(self.teams.getNationInfos(team));
          }
        });
        if (teams.length > 0) {
          group.teams = teams;
        }
      });

      $(this.el).html(te.renderTemplate(tmpl, {
        i18n : i18n,
        urls : urls
      }));

      this.getGames();
    },
    getGames : function() {
      // Bind functions to the view
      // By default, they bind to the window because they are callback functions
      this.successGetGamesCallback = _.bind(this.succesGetGames, this);

      return this.promise = LotofootApi.getPronosFromEvents({
        "events" : "CM2014",
        "userid" : this.user.get('userid')
      }, this.successGetGamesCallback, function(msg) {// error
        console.log(msg);
        // TODO : manage errors
      });
    },
    succesGetGames : function(msg) {
      var self = this;
      _.each(msg.games, function(game){
        var groupId = self.getGroupId(game.id_teamA, game.id_teamB);
        console.log(groupId);
      });
    },
    getGroupId : function(id_teamA, id_teamB){
      var id = 0;
      _.every(i18n.groups, function(group){
        if(_.indexOf(group,id_teamA) && _.indexOf(group,id_teamB)){
          id = group.id;
          return false;
        }
        return true;
      });
      return id;
    },
    /*
     * Events of the view
     */
    events : {
      'click .panel-footer' : 'enlargeGroup'
    },
    enlargeGroup : function(e) {
      var $target = this.$(e.currentTarget);
      this.$("#worldcup .group").removeClass('active');
      $target.parent().parent().addClass('active');
    }
  });

  // Our module now returns our view
  return ClassView;
}); 