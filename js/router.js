// Filename: router.js
define(['jquery', 'underscore', 'backbone', 'fmk/urls', 'fmk/eventbus',
        'views/headerview', 'views/footerview', 'views/homepageview', 'views/authentication/loginview',
        'views/pronos/createpronoview'],
function($, _, Backbone, urls, EventBus, HeaderView, FooterView, HomepageView, LoginView, CreatePronoView) {

    var AppRouter = Backbone.Router.extend({
      routes : _.object([
        [urls.HOME, 'homepage'],
        [urls.LOGIN, 'login'],
        [urls.CREATE_PRONO, 'createprono'],
        ['*action', 'defaultAction']
      ])
    });
    
    /* Initialize */
    var app_router = new AppRouter(); 

    var start = function(options) {
  
      var self = this;
      
      // Models
      this.user = options.user;
      this.browserStorage = options.browserStorage;
      this.teams = options.teams;
      
      // Global event bus
	    this.eventBus = EventBus.create();
	    app_router.listenTo(this.eventBus, 'url:change', function(e) {
	      app_router.navigate(e.url, {
	        trigger : true
	      });
	    });
  
      // Set header and footer
      var headerView = new HeaderView({user : this.user});
      var footerView = new FooterView();
      headerView.render();
      footerView.render();
  
      /* Set view for the routes */
      app_router.on('route:homepage', function() {
        var homepageView = new HomepageView({user : self.user});
        if (self.user.checkAuth()) {
          homepageView.render();
        } else {
          self.user.set('urlFrom', urls.HOME);
          self.eventBus.trigger('url:change', {url : '#' + urls.LOGIN});
        }
      });
      
      app_router.on('route:login', function() {
        var loginView = new LoginView({
          user : self.user,
          browserStorage : self.browserStorage,
          eventBus : self.eventBus
        });
        if (self.user.checkAuth()) {
          self.eventBus.trigger('url:change', {url : '#' + self.user.get('urlFrom')});
        } else {
          loginView.render();
        }
      });
      
      app_router.on('route:createprono', function() {
        var createpronoview = new CreatePronoView({
          user : self.user,
          teams : self.teams
        });
        if (self.user.checkAuth()) {
          createpronoview.render();
        } else {
          self.user.set('urlFrom', urls.HOME);
          self.eventBus.trigger('url:change', {url : '#' + urls.LOGIN});
        }
      });
  
      /* Route by default */
      app_router.on('route:defaultAction', function(actions) {
        // We have no matching route, lets just log what the URL was
        console.log('No route:', actions);
      });
  
      Backbone.history.start();
    }; 

    return {
      start : start
    };
});
