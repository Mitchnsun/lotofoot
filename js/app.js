// Filename: app.js
define(['router', 'models/user', 'models/browserStorage', 'models/teams'],
function(Router, User, BrowserStorage, Teams) {

  var initialize = function() {

		var router = new Router();
    var browserStorage = new BrowserStorage();
    var user = new User();
    var teams = new Teams();

    user.retrieveSession();
    $.when(user.promise, teams.promise).done(function() {// Wait if we can found a session for the user
     // Pass in our Router module and call it's initialize function
      router.start({
        user : user,
        browserStorage : browserStorage,
        teams : teams
      });
    });
  };

  return {
    initialize : initialize
  };
}); 