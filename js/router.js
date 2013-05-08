// Filename: router.js
define(['jquery', 'underscore', 'backbone', 'fmk/urls', 'fmk/eventbus',
        'views/headerview', 'views/footerview', 'views/homepageview', 'views/loginview'],
function($, _, Backbone, urls, EventBus, HeaderView, FooterView, HomepageView, LoginView) {

    var AppRouter = Backbone.Router.extend({
        routes : _.object([
            [urls.HOME, 'homepage'],
            [urls.LOGIN, 'login'],
            ['*action', 'defaultAction']
        ])
    });

    var initialize = function(options) {
    	//Loading bar
    	$('.bar').css("width","75%");
    	
        var self = this;
        var app_router = new AppRouter();
        
        this.user = options.user;

        // Global event bus
        this.eventBus = EventBus.create();
        app_router.listenTo(this.eventBus, 'url:change', function(e) {
            app_router.navigate(e.url, {
                trigger : true
            });
        });

        // Set header and footer
        var headerView = new HeaderView();
        var footerView = new FooterView();
        headerView.render();
        footerView.render();
		
		// Loading bar 100%
        $('.bar').css("width","100%");

        /* Set view for the routes */
        app_router.on('route:homepage', function() {
            var homepageView = new HomepageView();
            if(self.user.checkAuth()){
                homepageView.render();
            }else{
            	self.user.set('urlFrom', urls.HOME);
                self.eventBus.trigger('url:change',{url:'#'+urls.LOGIN});
            }
        });
        app_router.on('route:login', function() {
        	var loginView = new LoginView({user : self.user, eventBus : self.eventBus});
        	if(self.user.checkAuth()){
                self.eventBus.trigger('url:change',{url:'#'+self.user.set('urlFrom')});
            }else{
            	loginView.render();
            }
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
