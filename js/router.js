// Filename: router.js
define(['jquery', 'underscore', 'backbone', 'fmk/urls', 'fmk/eventbus',
        'views/headerview', 'views/footerview', 'views/homepageview', 'views/authentication/loginview',
        'views/pronos/creategamesview', 'views/pronos/pronosview'],
function($, _, Backbone, urls, EventBus, HeaderView, FooterView, HomepageView, LoginView, CreateGamesView, PronosView) {
	
  var AppRouter = Backbone.Router.extend({
    routes : _.object([
      [urls.HOME, 'homepage'],
      [urls.LOGIN, 'login'],
      [urls.PRONOS, 'pronos'],
      [urls.CREATE_GAMES, 'creategames'],
      ['*action', 'defaultAction']
    ]),
		start : function(options) {
			var self = this;
			
			// Models
			this.user = options.user;
			this.browserStorage = options.browserStorage;
			this.teams = options.teams;

			// Global event bus
			this.eventBus = EventBus.create();
			this.listenTo(this.eventBus, 'url:change', function(e) {
				self.navigate(e.url, {
					trigger : true
				});
			});

			// Set header and footer
			var headerView = new HeaderView({
				user : this.user
			});
			var footerView = new FooterView();
			headerView.render();
			footerView.render();

			Backbone.history.start();
		},
		loadView : function(view){
			this.view && this.view.undelegateEvents();
			this.view = view;
		},
		/*
		 * Set view for the routes
		 */
		homepage : function() {
				this.loadView(new HomepageView({
					user : this.user
				}));
				if (this.user.checkAuth()) {
					this.view.render();
				} else {
					this.user.set('urlFrom', urls.HOME);
					this.eventBus.trigger('url:change', {
						url : '#' + urls.LOGIN
					});
				}
			},
			login : function() {
				this.loadView(new LoginView({
					user : this.user,
					browserStorage : this.browserStorage,
					eventBus : this.eventBus
				}));
				if (this.user.checkAuth()) {
					this.eventBus.trigger('url:change', {
						url : '#' + this.user.get('urlFrom')
					});
				} else {
					this.view.render();
				}
			},
			creategames : function() {
				this.loadView(new CreateGamesView({
					user : this.user,
					teams : this.teams
				}));
				if (this.user.checkAuth()) {
					this.view.render();
				} else {
					this.user.set('urlFrom', urls.CREATE_GAMES);
					this.eventBus.trigger('url:change', {
						url : '#' + urls.LOGIN
					});
				}
			},
			pronos : function() {
				this.loadView(new PronosView({
					user : this.user,
					teams : this.teams
				}));
				if (this.user.checkAuth()) {
					this.view.render();
				} else {
					this.user.set('urlFrom', urls.PRONOS);
					this.eventBus.trigger('url:change', {
						url : '#' + urls.LOGIN
					});
				}
			},
			/* Route by default */
			defaultAction : function(actions) {
				// We have no matching route, lets just log what the URL was
				console.log('No route:', actions);
			}
	});

  return AppRouter;
});
