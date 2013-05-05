// Filename: app.js
define(['router', 'models/user'],
function(Router, User) {

	var initialize = function() {
	    var user = new User();
		// Pass in our Router module and call it's initialize function
		Router.initialize({user: user});
	};

	return {
		initialize : initialize
	};
});