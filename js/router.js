// Filename: router.js
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	
	var AppRouter = Backbone.Router.extend({
		routes : {
			'' : 'homepage',
			// Default
			'*actions' : 'defaultAction'
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;
		
		app_router.on('route:homepage', function() {
			// We have no matching route, lets just log what the URL was
			console.log('homepage');
		});
		app_router.on('route:defaultAction', function(actions) {
			// We have no matching route, lets just log what the URL was
			console.log('No route:', actions);
		});
		Backbone.history.start();
	};
	return {
		initialize : initialize
	};
});
