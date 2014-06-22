define(['jquery', 'underscore', 'backbone', 'fmk/lotofootapi', 'i18n!nls/country'],
function($, _, Backbone, LotofootApi, country) {

  var Model = Backbone.Model.extend({
    defaults : {
      clubs : [],
      international : []
    },
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
      var clubs = msg.clubs;
      var international = msg.international;
      var clubsList = [];

      _.each(clubs, function(item) {// fetch the right name of the country
        item.name = country[item.id].name;
        clubsList.push(item);
      });

      _.each(international, function(item) {// Function for the multi-lingual, the database is in French
        item.name = country[item.country].name;
      });

      this.set('clubs', clubsList);
      this.set('international', international);
    },
    /*
     * Get the information of a teams
     */
    getClubInfos : function(id, country) {// return the all the infos of the team in an object
      var club = {};
      var array = [];

      _.every(this.get('clubs'), function(object) {
        if (object.id == country) {
          array = object.recs;
          return false;
        }
        return true;
      });

      _.every(array, function(team) {
        if (team.id == id) {
          club = team;
          return false;
        }
        return true;
      });

      return club;
    },
    getNationInfos : function(id) {
      var nation = {};

      _.every(this.get('international'), function(item) {
        if (item.id == id) {
          nation = item;
          return false;
        }
        return true;
      });

      return nation;
    },
    getTeams : function(id, country) {
      var self = this;
      var team = this.getNationInfos(id);
      if (!$.isEmptyObject(team)) {
        /* Do Nothing the team is a country */
      } else if (country === undefined || country === '') {
        _.every(this.get('clubs'), function(object) {
          team = self.getClubInfos(id, object.id);
          if (!$.isEmptyObject(team)) {
            return false;
          }
          return true;
        });
      } else {
        team = this.getClubInfos(id, country);
      }

      return team;
    }
  });

  // Return the model for the module
  return Model;
});
