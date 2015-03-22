define(['jquery', 'underscore', 'backbone', 'fmk/lotofootapi', 'fmk/urls'],
function($, _, Backbone, LotofootApi, urls) {
  var Model = Backbone.Model.extend({
    defaults : {
      sessionRetrieve : false,
      isConnected : false,
      urlFrom : urls.HOME.hash
    },
    /*
     * Authentication
     */
    connect : function(user) {
    	var urlFrom = this.get('urlFrom');
      this.set(user);
      this.set({
        isConnected : true,
        urlFrom : urlFrom
      });
    },
    checkAuth : function() {
      return this.get('isConnected');
    },
    retrieveSession : function() {
      var self = this;
      if ( typeof localStorage !== undefined) {
        this.set({
          userid : localStorage.getItem("userid"),
          sessionid : localStorage.getItem("sessionid"),
          lastLogedIn : localStorage.getItem("lastLogedIn")
        });

        this.checkSession();
      }
    },
    checkSession : function() {
      var self = this;
      if (this.get('sessionid') === undefined) {
        return false;
        // if local storage are empty, do not lose time to call a web service
      }
      return this.promise = LotofootApi.checkSession({
        userid : this.get('userid'),
        sessionid : this.get('sessionid'),
        lastLogedIn : this.get('lastLogedIn')
      }, function(msg) {// success
        if (msg.sessionRetrieve === true) {
          self.set({
            sessionRetrieve : true
          });
          self.connect(msg.user);
          if ( typeof localStorage !== undefined) {// Set the local storage with the new information
            localStorage.userid = self.get('userid');
            localStorage.sessionid = self.get('sessionid');
            localStorage.lastLogedIn = self.get('lastLogedIn');
          }
        }
      }, function() {// error
        /* If they are an error, no need to handle it */
      });
    }
  });
  // Return the model for the module
  return Model;
});
