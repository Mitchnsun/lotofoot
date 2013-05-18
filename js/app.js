// Filename: app.js
define(['router', 'models/user', 'models/browserStorage'],
function(Router, User, BrowserStorage) {

	var initialize = function() {

	    var user = new User();
	    var browserStorage = new BrowserStorage();
		// Pass in our Router module and call it's initialize function
		Router.initialize({user : user, browserStorage : browserStorage});
	};

	return {
		initialize : initialize
	};
});