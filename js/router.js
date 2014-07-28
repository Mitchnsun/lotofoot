// Filename: router.js
define(['jquery', 'underscore', 'backbone', 'fmk/urls', 'fmk/eventbus', 'fmk/alertview',
				'collections/ranking',
        'views/menuview', 'views/footerview'],
function($, _, Backbone, urls, EventBus, AlertView, Ranking, MenuView, FooterView) {
	
	var AppRouter = Backbone.Router.extend({
		initialize : function(){
			var self = this;
			
			// Global event bus & alert view
			this.alertview = new AlertView();
			this.eventBus = EventBus.create();
			this.listenTo(this.eventBus, 'url:change', function(e) {
				self.navigate(e.url, {trigger : true});
			});
		},
		routes : _.object([
		  [urls.ROOT, 'homepage'],
			[urls.CREATE_GAMES, 'creategames'],
			[urls.HOME, 'homepage'],
			[urls.LOGIN + '(/:action/:param)', 'login'],
			[urls.NEW_ACCOUNT, 'newaccount'],
			[urls.PRONOS, 'pronos'],
			[urls.RANKING + '(/:type/s:season)', 'ranking'],
			[urls.TOP_PRONOS + "/:event", 'toppronos'],
			[urls.WORLDCUP + '(/:type)', 'worldcup'],
			['*action', 'defaultAction']
		]),
		start : function(options) {
			// Models
			this.user = options.user;
			this.browserStorage = options.browserStorage;
			this.teams = options.teams;
			this.ranking = new Ranking();
			this.ranking.load();

			// Set menu and footer
			this.menuView = new MenuView({
				user : this.user,
				ranking : this.ranking
			});
			this.footerView = new FooterView();
			this.menuView.render();
			this.footerView.render();

			Backbone.history.start();
		},
		loadView : function(view) {
			this.view && (this.view.close ? this.view.close() : this.view.undelegateEvents());
			this.view = view;
		},
		/*
		 * Set view for the routes
		 */
		creategames : function() {
			var self = this;
			if (this.user.checkAuth() && this.user.get('accreditation') == 'Admin') {
				require(['views/pronos/creategamesview'], function(CreateGamesView) {
					self.loadView(new CreateGamesView({
						user : self.user,
						alertview : self.alertview,
						teams : self.teams
					}));
					self.view.render();
					self.menuView.menuChange(urls.CREATE_GAMES);
				});
			} else if(this.user.checkAuth()){
				this.eventBus.trigger('url:change', {url : '#' + urls.HOME});
			} else {
				this.user.set('urlFrom', urls.CREATE_GAMES);
				this.eventBus.trigger('url:change', {url : '#' + urls.LOGIN});
			}
		},
		homepage : function() {
			var self = this;
			if (this.user.checkAuth()) {
				require(['views/homepageview'], function(HomepageView) {
					self.loadView(new HomepageView({
						user : self.user,
						alertview : self.alertview,
						teams : self.teams,
						ranking : self.ranking
					}));
					self.view.render();
					self.menuView.menuChange(urls.HOME);
				});
			} else {
				this.user.set('urlFrom', urls.HOME);
				this.eventBus.trigger('url:change', {url : '#' + urls.LOGIN});
			}
		},
		login : function(action, param) {
			var self = this;
			if (this.user.checkAuth()) {
				this.eventBus.trigger('url:change', {url : '#' + this.user.get('urlFrom')});
			} else {
				require(['views/authentication/loginview'], function(LoginView) {
					self.loadView(new LoginView({
						user : self.user,
						alertview : self.alertview,
						browserStorage : self.browserStorage,
						eventBus : self.eventBus,
						action : action,
						param : param
					}));
					self.view.render();
					self.menuView.menuChange(urls.LOGIN);
				});
			}
		},
		newaccount : function() {
			var self = this;
			require(['views/account/createview'], function(CreateAccountView) {
				self.loadView(new CreateAccountView({
					user : self.user,
					alertview : self.alertview,
					browserStorage : self.browserStorage,
					eventBus : self.eventBus
				}));
				self.view.render();
				self.menuView.menuChange(urls.NEW_ACCOUNT);
			});
		},
		pronos : function() {
			var self = this;
			if (this.user.checkAuth()) {
				require(['views/pronos/pronosview'], function(PronosView) {
					self.loadView(new PronosView({
						user : self.user,
						alertview : self.alertview,
						teams : self.teams
					}));
					self.view.render();
					self.menuView.menuChange(urls.PRONOS);
				});
			} else {
				this.user.set('urlFrom', urls.PRONOS);
				this.eventBus.trigger('url:change', {url : '#' + urls.LOGIN});
			}
		},
		ranking : function(type, season) {
			var self = this;
			if (this.user.checkAuth()) {
				require(['views/ranking/rankingview'], function(RankingView) {
					self.loadView(new RankingView({
					  type : type,
					  season : season,
						user : self.user,
						alertview : self.alertview,
						ranking : self.ranking
					}));
					self.view.render();
					self.menuView.menuChange(urls.RANKING);
				});
			} else {
				this.user.set('urlFrom', urls.RANKING);
				this.eventBus.trigger('url:change', {url : '#' + urls.LOGIN});
			}
		},
		toppronos : function() {
      var self = this;
      if (this.user.checkAuth()) {
        require(['views/pronos/topview'], function(TopView) {
          self.loadView(new TopView({
            user : self.user,
            alertview : self.alertview,
            teams : self.teams
          }));
          self.view.render();
          self.menuView.menuChange(urls.TOP_PRONOS);
        });
      } else {
        this.user.set('urlFrom', urls.TOP_PRONOS);
        this.eventBus.trigger('url:change', {url : '#' + urls.LOGIN});
      }
    },
		worldcup : function(type) {
			var self = this;
			if (this.user.checkAuth()) {
				require(['views/events/worldcupview'], function(WorldCupView) {
					self.loadView(new WorldCupView({
						user : self.user,
						alertview : self.alertview,
						teams : self.teams,
						ranking : self.ranking,
						type : type
					}));
					self.view.render();
					self.menuView.menuChange(urls.WORLDCUP);
				});
			} else {
        this.user.set('urlFrom', urls.WORLDCUP);
        this.eventBus.trigger('url:change', {url : '#' + urls.LOGIN});
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
