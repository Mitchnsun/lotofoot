define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'models/game',
        'text!tmpl/teams/pickTeam.html','i18n!tmpl/pronos/nls/creategames', 'i18n!nls/country',],
function($, _, Backbone, te, Game, tmpl, i18n, country) {
    
  var ClassView = Backbone.View.extend({
    initialize : function(options){
      this.user = options.user;
      this.el = options.el;
      this.teams = options.teams;
      
      this.newGame();
    },
    render : function() {
      $(this.el).html(te.renderTemplate(tmpl, {
        i18n : i18n,
        clubs : this.teams.get('clubs'),
        international : this.teams.get('international')
      }));
    },
    newGame : function(){
      this.game = new Game({addBy : this.user.get('userid')});
    },
    /*
     * Events of the view
     */
    events : {
      "click #SelectGame a" : "kindOfGame",
      "click #Clubs a.country" : "selectCountry",
      "click a.club" : "pickATeam",
      "click a.international" : "pickANationalTeam",
    },
    kindOfGame : function(e) {// Pick the type of the game to bet
      e.preventDefault();
      this.game.set('type', this.$(e.currentTarget).attr('ref'));
      
      this.$("#SelectGame").addClass('hide');
      // Display the right list in terms of the choice
      if (this.game.get('type') == i18n.ref_international_game) {
        this.$('#International').removeClass('hide');
      } else {
        this.$('#Clubs').removeClass('hide');
      }
    },
    selectCountry : function(e) {// Pick the country where the clubs are from
      e.preventDefault();
      var ref = this.$(e.currentTarget).attr('ref');
      var $selectedCountry = this.$(e.currentTarget).parent();
      $selectedCountry.removeClass('span3').addClass('span12');

      var $listCountry = this.$("#Clubs > div.span3");
      $listCountry.addClass('hide');
      
      // Hide the other country
      $selectedCountry.find('div.row.hide').removeClass('hide');
    },
    pickATeam : function(e) {// Pick a team
      e.preventDefault();
      
      if (this.game.ready()) {// A game cannot have more than two teams !
        return false;
      }

      /* Initialize variables */
      var gameType = this.game.get('type');
      var $element = this.$(e.currentTarget);
      var ref = $element.attr('ref');
      var country = $element.attr('data-country');
      var $selectedCountry = $element.parents('div.span12');
      var $listCountry = this.$("#Clubs > div.span3");
      var team = this.teams.getClubInfos(ref, country);

      if (gameType == i18n.ref_league_game || gameType == i18n.ref_cup_game) {
        this.game.addTeam(team);
        this.game.set('country', country);
      } else if (gameType == i18n.ref_europa_game) {
        this.game.addTeam(team);
        $selectedCountry.find('div.row').addClass('hide');
        $selectedCountry.removeClass('span12').addClass('span3');
        $listCountry.removeClass('hide');
      } else {
        return false;
        // TODO : Display errors
      }

      $element.parent().addClass('hide');
      this.trigger('add:team', this.game);
    },
    pickANationalTeam : function(e) {
      e.preventDefault();

      if (this.game.ready()) {// A game cannot have more than two teams !
        return false;
      }
      
      /* Initialize variables */
      var ref = this.$(e.currentTarget).attr('ref');
      var nation = this.teams.getNationInfos(ref);
      var gameType = this.game.get('type');

      if (gameType == i18n.ref_international_game) {
        this.game.addTeam(nation);
      } else {
        return false;
        // TODO : Display errors
      }

      this.$(e.currentTarget).parent().addClass('hide');
      this.trigger('add:team', this.game);
    }
  });
  
  // Our module now returns our view
  return ClassView;
});