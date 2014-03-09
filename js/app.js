// Filename: app.js
define(['router', 'models/user', 'models/browserStorage'],
function(Router, User, BrowserStorage) {

	var initialize = function() {

		var browserStorage = new BrowserStorage();
	    var user = new User();
	    
	    user.retrieveSession();
	    $.when(user.promise).done(function(){ // Wait if we can found a session for the user
			// Pass in our Router module and call it's initialize function
			Router.initialize({user : user, browserStorage : browserStorage});
		});
	};

	return {
		initialize : initialize
	};
});