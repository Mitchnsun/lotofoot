// Filename: router.js
define(['jquery','underscore','backbone', 'fmk/urls', 'fmk/eventbus', 'views/headerview', 'views/footerview', 'views/homepageview'],
function($, _, Backbone, urls, EventBus, HeaderView, FooterView, HomepageView) {

	var AppRouter = Backbone.Router.extend({
		routes : _.object([
		   [urls.HOME , 'homepage'],
		   ['*action' , 'defaultAction']
		])
	});

	var initialize = function() {
		var app_router = new AppRouter;
		
		// Global event bus
		this.eventBus = EventBus.create();
		app_router.listenTo(this.eventBus, 'url:change', function(e){
		    app_router.navigate(e.url, {trigger:true});
		});
        
        // Set header and footer
        var headerView = new HeaderView();
        var footerView = new FooterView();
        headerView.render();
        footerView.render();
        
        /* Set view for the routes */
		app_router.on('route:homepage', function() {
			var homepageView = new HomepageView();
			homepageView.render();
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
