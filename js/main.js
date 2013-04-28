// Filename: main.js

// Require.js allows us to configure shortcut alias
require.config({
	paths : {
		'jquery' : 'libs/jquery', /* v2.0.0 exclude IE 6,7,8 */
		'underscore' : 'libs/underscore', /* v1.4.4 */
		'backbone' : 'libs/backbone', /* v1.0.0 */
		'bootstrap' : 'libs/bootstrap.min' /* v2.3.1 */
	}

});
require(['app'], // Load our app module and pass it to our definition function
function(App) {
	// The "app" dependency is passed in as "App"
	App.initialize();
}); 