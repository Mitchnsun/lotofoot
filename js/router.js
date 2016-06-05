// Filename: router.js
define(['jquery', 'underscore', 'backbone', 'fmk/urls', 'fmk/eventbus', 'fmk/alertview',
				'rankings/ranking', 'common/menuview', 'common/footerview'],
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
		  [urls.ROOT.hash, 'dispatch'],
		  [urls.ADMIN.hash, 'dispatchAdmin'],
			[urls.CREATE_GAMES.hash, 'dispatchAdmin'],
			[urls.HOME.hash, 'dispatch'],
			[urls.LOGIN.hash + '(/:action/:param)', 'login'],
			[urls.NEW_ACCOUNT.hash, 'newaccount'],
			[urls.PROFILE.hash, 'dispatch'],
			[urls.PRONOS.hash, 'dispatch'],
			[urls.RANKING.hash + '(/:type/s:season)', 'ranking'],
			[urls.EURO.hash + '(/:type)', 'worldcup'],
			[urls.WORLDCUP.hash + '(/:type)', 'worldcup'],
			['*action', 'defaultAction']
		]),
		/* Start Router */
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
		/* Retrieve the path of the view file for an hash */
		pathForView : function(hash){
			var path = "";
			if(hash == ""){
				return urls.ROOT.path;
			}
			_.every(urls, function(item){
				if(hash.match(item.hash)){
					path = item.path;
					return false;
				}
				return true;
			});
			return path;
		},
		/*
		 * Set view for the routes, specific functions
		 * see below for generic functions
		 */
		login : function(action, param) {
			var self = this;
			if (this.user.checkAuth()) {
				this.eventBus.trigger('url:change', {url : '#' + this.user.get('urlFrom')});
			} else {
				require([urls.LOGIN.path], function(LoginView) {
					self.loadView(new LoginView({
						user : self.user,
						alertview : self.alertview,
						browserStorage : self.browserStorage,
						eventBus : self.eventBus,
						action : action,
						param : param
					}));
					self.view.render();
					self.menuView.menuChange(urls.LOGIN.hash);
				});
			}
		},
		newaccount : function() {
			var self = this;
			require([urls.NEW_ACCOUNT.path], function(CreateAccountView) {
				self.loadView(new CreateAccountView({
					user : self.user,
					alertview : self.alertview,
					browserStorage : self.browserStorage,
					eventBus : self.eventBus
				}));
				self.view.render();
				self.menuView.menuChange(urls.NEW_ACCOUNT.hash);
			});
		},
		ranking : function(type, season) {
			var params = {
				type : type,
				season : season
			};
			this.dispatch(params);
		},
		worldcup : function(type) {
			var params = {type : type};
			this.dispatch(params);
		},
		/* Generic function for routing the view */
		dispatch : function(params){
			var self = this;
			var hash = window.location.hash.replace('#','');
			
			if (this.user.checkAuth()) {
				require([this.pathForView(hash)], function(View) {
					self.loadView(new View({
						user : self.user,
						alertview : self.alertview,
						browserStorage : self.browserStorage,
						eventBus : self.eventBus,
						teams : self.teams,
						ranking : self.ranking,
						params : params
					}));
					self.view.render();
					self.menuView.menuChange(hash);
				});
			} else {
				var urlRedirect = hash;
				if(params && params.type && params.season){
					urlRedirect += '/' + params.type + '/s' + params.season;
				}
				this.user.set('urlFrom', urlRedirect);
				this.eventBus.trigger('url:change', {url : '#' + urls.LOGIN.hash});
			}
		},
		dispatchAdmin : function() {
			var self = this;
			var hash = window.location.hash.replace('#','');
			
			if (this.user.checkAuth() && this.user.get('accreditation') == 'Admin') {
				require([this.pathForView(hash)], function(View) {
					self.loadView(new View({
						user : self.user,
						alertview : self.alertview,
						teams : self.teams
					}));
					self.view.render();
					self.menuView.menuChange(hash);
				});
			} else if(this.user.checkAuth()){
				this.eventBus.trigger('url:change', {url : '#' + urls.HOME.hash});
			} else {
				this.user.set('urlFrom', hash);
				this.eventBus.trigger('url:change', {url : '#' + urls.LOGIN.hash});
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