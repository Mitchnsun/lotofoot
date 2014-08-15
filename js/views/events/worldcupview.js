define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
        'collections/games', 'models/game', 'i18n!tmpl/events/nls/worldcup',
        'text!tmpl/events/worldcup.html', 'text!tmpl/events/pronoworldcup.html'],
function($, _, Backbone, te, LotofootApi, urls, Games, Game, i18n, tmpl, tmplProno) {

  var ClassView = Backbone.View.extend({
    el : $('#container'),
    initialize : function(options) {
      this.user = options.user;
      this.alertview = options.alertview;
      this.teams = options.teams;
      this.ranking = options.ranking;
      this.panelType = options.type;
      
      this.groupsGames = new Games(); // Collection with the games for groups stage
      this.secondStageGames = new Games(); // Collection with the games after the groups
    },
    render : function() {
      var self = this;

      // Get teams infos
      _.each(i18n.groups, function(group) {
        var teams = [];
        _.each(group.idTeams, function(team) {
          teams.push(self.teams.getTeams(team));
        });
        if (teams.length > 0) {
          group.teams = teams;
        }
      });
      
      $(this.el).html(te.renderTemplate(tmpl, {
        i18n : i18n,
        urls : urls
      }));
      
      if(this.panelType == 'playoff'){
      	this.$('.worldcuppanel').hide();
      	this.$('#' + this.panelType).show();
      	this.$('ul li.active').removeClass('active');
				this.$('#playoffNav').addClass('active');
      }

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
      this.secondStageGames.reset();
      
      _.each(msg.games, function(game){
      	var game = new Game(game);
      	game.set('teamA', self.teams.getTeams(game.get('id_teamA')));
    		game.set('teamB', self.teams.getTeams(game.get('id_teamB')));
      	if(game.get('stage') == "Groups"){
      		var groupId = self.getGroupId(game.get('id_teamA'), game.get('id_teamB'));
      		game.set('groupId',groupId);
      		self.groupsGames.add(game);
      	} else {
      		self.secondStageGames.add(game);
      	}
      });
      
      this.setPlayoffGames();
    },
    getGroupId : function(id_teamA, id_teamB){
      var id = 0;
      
      _.every(i18n.groups, function(group){
        if(_.indexOf(group.idTeams,id_teamA) != -1 && _.indexOf(group.idTeams,id_teamB) != -1){
          id = group.id;
          return false;
        }
        return true;
      });
      return id;
    },
    setPlayoffGames : function(){
    	var self = this;
    	var stages = ["Final", "ThirdPlace", "Semi", "Last8", "Last16"];
    	
    	_.each(stages, function(stage){
    		var tempArray = self.secondStageGames.where({"stage" : stage});
	    	var games = [];
	    	
	    	_.each(tempArray, function(game){
	    		games.push(game.toJSON());
	    	});
	    	
	    	self.$('#playoff').append(te.renderTemplate(tmplProno, {
	        i18n : i18n,
	        urls : urls,
	        games : games,
	        title : i18n[stage],
	        score : _.range(10)
	      }));
    	});
    	this.delegateEvents();
    },
    /*
     * Events of the view
     */
    events : {
      'click .panel-footer' : 'enlargeGroup',
      'click button.scoreUpdate' : 'betOnAGame',
      'click .nav a' : 'worldcupnav',
      'change #playoff select.selectScore' : 'enablePlayoffWinner',
      'click .teamsContainer.active label' : 'selectWinner'
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
      if(game === undefined){
      	game = this.secondStageGames.findWhere({"id_game" : ref});
      }
      
      if (game.get('prono') === undefined) {// User suggests a score for the game
        this.suggestScore(ref, game);
      }else {// User decides to update his prono
        this.updateProno(ref, game);
      }
    },
    worldcupnav : function(e){
			e.preventDefault();
			this.$('ul li.active').removeClass('active');
			this.$(e.currentTarget).parent().addClass('active');
			this.$('.worldcuppanel').hide();
			
			var id = this.$(e.currentTarget).attr('ref');
			this.$(id).show();
		},
		enablePlayoffWinner : function(e){
			var self = this;
			var teamsContainer = this.$(e.currentTarget).parent().parent();
			var scoreA = 'A';
			var scoreB = 'B';
			
			_.each(teamsContainer.find('select'), function(select){
				var $select = self.$(select);
				if($select.attr('ref') == 'A'){
					scoreA = $select.val();
				} else if ($select.attr('ref') == 'B'){
					scoreB = $select.val();
				}
			});
			
			if (scoreA != scoreB){
				teamsContainer.removeClass('active');
				var winner = teamsContainer.find('.winner');
				this.$(winner).removeClass('winner');
			} else {
				// Same score, enable the choice for the winner
				teamsContainer.addClass('active');
			}
		},
		selectWinner : function(e){
			e.preventDefault();
			var teamsContainer = this.$(e.currentTarget).parent().parent();
			var $parentElement = this.$(e.currentTarget).parent();
			
			if ($parentElement.hasClass('winner')){
				$parentElement.removeClass('winner');
			} else {
				var span = this.$(teamsContainer).find('.span4');
				this.$(span).removeClass('winner');
				$parentElement.addClass('winner');
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
    	
    	this.$('.group.active .panel-body.games').html(te.renderTemplate(tmplProno, {
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
        scoreB : scoreB,
        winner : this.getWinner($rowGame)
      };
      
      $rowGame.find('.buttons button').attr('disabled', true);
      
      LotofootApi.addProno({
        userid : this.user.get('userid'),
        id_game : ref,
        scoreA : scoreA,
        scoreB : scoreB,
        winner : prono.winner
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
        scoreB : scoreB,
        winner : this.getWinner($rowGame)
      };
      
      $rowGame.find('.buttons button').attr('disabled', true);

      LotofootApi.updateProno({
        userid : this.user.get('userid'),
        id_game : ref,
        scoreA : scoreA,
        scoreB : scoreB,
        winner : prono.winner
      }, function(msg) {// success
        self.alertview.displayAlert('success', 'success', i18n.updateProno);
        $rowGame.find('.buttons button').attr('disabled', false);
        game.set('prono', prono);
      }, function(msg) {// error
        self.alertview.displayError(msg.status, msg.errorCode);
        $rowGame.find('.buttons button').attr('disabled', false);
      });
    },
    getWinner : function($rowGame){
    	var winner = $rowGame.find('.winner');
    	
    	if(winner.length > 0){
    		return this.$(winner).attr('ref');
    	} else {
    		return '';
    	}
    }
  });

  // Our module now returns our view
  return ClassView;
}); 