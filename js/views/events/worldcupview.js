define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
        'collections/games', 'models/game', 'i18n!tmpl/events/nls/worldcup',
        'text!tmpl/events/worldcup.html', 'text!tmpl/events/pronogroup.html'],
function($, _, Backbone, te, LotofootApi, urls, Games, Game, i18n, tmpl, tmplGroup) {

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
        var teams = [];
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
      }, this.successGetGamesCallback, function(msg) {console.log(msg); /* TODO : manage errors */ });
    },
    succesGetGames : function(msg) {
      var self = this;
      this.groupsGames.reset();
      _.each(msg.games, function(game){
        var groupId = self.getGroupId(game.id_teamA, game.id_teamB);
        var game = new Game(game);
        game.set('groupId',groupId);
        game.set('teamA', self.teams.getNationInfos(game.get('id_teamA')));
    		game.set('teamB', self.teams.getNationInfos(game.get('id_teamB')));
        self.groupsGames.add(game);
      });
    },
    getGroupId : function(id_teamA, id_teamB){
      var id = 0;
      id_teamA = parseInt(id_teamA,10);
      id_teamB = parseInt(id_teamB,10);
      _.every(i18n.groups, function(group){
        if(_.indexOf(group.idTeams,id_teamA) != -1 && _.indexOf(group.idTeams,id_teamB) != -1){
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
      'click .panel-footer' : 'enlargeGroup',
      'click button.scoreUpdate' : 'betOnAGame'
    },
    enlargeGroup : function(e) {
    	var self = this;
      var $target = this.$(e.currentTarget);
      this.$("#worldcup .group").removeClass('active');
      $target.parent().parent().addClass('active');
      $.when(this.promise).then(function(){
      	var id = $target.attr('data-ref');
      	self.displayGameFor(id);
      });
    },
    betOnAGame : function(e) {
      var ref = $(e.currentTarget).attr('data-ref');
      var game = this.groupsGames.findWhere({"id_game" : ref});
      console.log(game.get('prono'));
      if (game.get('prono') === undefined) {// User suggests a score for the game
        this.suggestScore(ref, game);
      }else {// User decides to update his prono
        this.updateProno(ref, game);
      }
    },
    /*
     * Handle pronos
     */
    displayGameFor : function(id){
    	var self = this;
    	var tempArray = this.groupsGames.where({"groupId" : id});
    	var games = [];
    	
    	_.each(tempArray, function(game){
    		games.push(game.toJSON());
    	});
    	
    	this.$('.group.active .panel-body.games').html(te.renderTemplate(tmplGroup, {
        i18n : i18n,
        urls : urls,
        games : games,
        score : _.range(10)
      }));
      
      this.delegateEvents();
      $('html, body').animate({scrollTop:this.$('.group.active').position().top}, 'slow');
    },
    /*
     * Action on the bet button
     */
    suggestScore : function(ref, game) {
      var self = this;
      var $rowGame = this.$('.rowGame[ref="' + ref + '"]');
      var scoreA = $rowGame.find('.teamA select').val();
      var scoreB = $rowGame.find('.teamB select').val();
      var prono = {
        scoreA : scoreA,
        scoreB : scoreB
      };
      
      $rowGame.find('.buttons button').attr('disabled', true);
      
      LotofootApi.addProno({
        userid : this.user.get('userid'),
        id_game : ref,
        scoreA : scoreA,
        scoreB : scoreB
      }, function(msg) {// success
        self.alertview.displayAlert('success', 'success', i18n.AddProno);
        $rowGame.find('.buttons button').attr('disabled', false);
        game.set('prono', prono);
      }, function(msg) {// error
        self.alertview.displayError(msg.status, msg.errorCode);
        $rowGame.find('.buttons button').attr('disabled', false);
      });
    },
    updateProno : function(ref, game){
      var self = this;
      var $rowGame = this.$('.rowGame[ref="' + ref + '"]');
      var scoreA = $rowGame.find('.teamA select').val();
      var scoreB = $rowGame.find('.teamB select').val();
      var prono = {
        scoreA : scoreA,
        scoreB : scoreB
      };
      
      $rowGame.find('.buttons button').attr('disabled', true);

      LotofootApi.updateProno({
        userid : this.user.get('userid'),
        id_game : ref,
        scoreA : scoreA,
        scoreB : scoreB
      }, function(msg) {// success
        self.alertview.displayAlert('success', 'success', i18n.updateProno);
        $rowGame.find('.buttons button').attr('disabled', false);
        game.set('prono', prono);
      }, function(msg) {// error
        self.alertview.displayError(msg.status, msg.errorCode);
        $rowGame.find('.buttons button').attr('disabled', false);
      });
    }
  });

  // Our module now returns our view
  return ClassView;
}); 