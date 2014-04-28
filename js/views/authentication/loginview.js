define(['jquery', 'underscore', 'backbone',
		'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
		'i18n!tmpl/authentication/nls/login',
		'text!tmpl/authentication/login.html'],
function($, _, Backbone, te, LotofootApi, urls, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		initialize : function(options) {
			this.user = options.user;
			this.alertview = options.alertview;
			this.browserStorage = options.browserStorage;
			this.eventBus = options.eventBus;
		},
		el : $('#container'),
		render : function() {
			$(this.el).html(te.renderTemplate(tmpl, {i18n : i18n}));
			
			if(this.browserStorage.get('hasLocalStorage') === false){ // Display a message if the browser can't use localStorage
				this.browserStorage.noSupport(this.alertview, i18n.WebStorageLogin);
				this.$('label.checkbox').remove();
			}
		},
		/*
		 * Events of the view
		 * submitLogIn : submit the form to log in, check if the input are filled, call WS and make the redirection
		 */
		events : {
			"submit" : "submitLogIn"
		},
		submitLogIn : function(e) {
			e.preventDefault();// cancel all actions linked to this click
			this.$('input[type="submit"]').attr('disabled',true);
			
			var self = this;
			var params = {};
			var errors = false;
			var inputEmail = this.$('#userEmail');
			var inputPwd = this.$('#userPwd');

			// Check value
			if (inputEmail.val() === '') {
				inputEmail.parent().parent().addClass('error');
				errors = true;
			}
			if (inputPwd.val() === '') {
				inputPwd.parent().parent().addClass('error');
				errors = true;
			}

			if (errors) {// Display errors if they exist
				this.alertview.displayAlert('warning', 'default', i18n.EmptyLogIn);
				this.$('input[type="submit"]').attr('disabled',false);
				return;
			}

			LotofootApi.login({
				userEmail : inputEmail.val(),
				userPwd : inputPwd.val()
			}, function(msg) { // success
				self.alertview.dismissAlert();
				self.$('input[type="submit"]').attr('disabled',false);

				if(msg.errors){
					self.alertview.displayAlert('warning', msg.errors.title, i18n[msg.errors.errorCode]);
				}else{ // Everything is good
					self.user.connect(msg.user);
					if(self.$('input[type="checkbox"]').is(':checked')){
						self.saveSession();
					}
					self.eventBus.trigger('url:change',{url:'#'+urls.HOME});
				}
				
			}, function(msg) { // error
				self.alertview.displayError(msg.status, msg.errorCode);
				self.$('input[type="submit"]').attr('disabled',false);
			});
		},
		/*
		 * Save session id, userid and date of connexion in the local Storage
		 * Permits to retrieve the session later
		 */
		saveSession : function(){
			if(this.browserStorage.get('hasLocalStorage')){
				localStorage.setItem("userid",this.user.get('userid'));
				localStorage.setItem("sessionid",this.user.get('sessionid'));
				localStorage.setItem("lastLogedIn",this.user.get('lastLogedIn'));
			}	
		}
	});

	// Our module now returns our view
	return ClassView;
}); 