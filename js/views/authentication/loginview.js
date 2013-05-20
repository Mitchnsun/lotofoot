define(['jquery', 'underscore', 'backbone',
		'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
		'i18n!tmpl/authentication/nls/login',
		'text!tmpl/authentication/login.html'],
function($, _, Backbone, te, LotofootApi, AlertView, urls, i18n, tmpl) {

	var ClassView = Backbone.View.extend({
		initialize : function() {
			this.user = this.options.user;
			this.browserStorage = this.options.browserStorage;
			this.eventBus = this.options.eventBus;
			
			this.alertView = new AlertView();
		},
		el : $('#container'),
		render : function() {
			$(this.el).html(te.renderTemplate(tmpl, {i18n : i18n}));
			
			if(this.browserStorage.get('hasLocalStorage') === false){ // Display a message if the browser can't use localStorage
				this.browserStorage.noSupport(this.alertView, 'WebStorageLogin');
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
			if (inputEmail.val() == '') {
				inputEmail.parent().parent().addClass('error');
				errors = true;
			}
			if (inputPwd.val() == '') {
				inputPwd.parent().parent().addClass('error');
				errors = true;
			}

			if (errors) {// Display errors if they exist
				this.alertView.displayAlert('warning', 'default', 'EmptyLogIn');
				this.$('input[type="submit"]').attr('disabled',false);
				return;
			}

			LotofootApi.login({
				userEmail : inputEmail.val(),
				userPwd : inputPwd.val()
			}, function(msg) { // success
				self.alertView.dismissAlert();
				this.$('input[type="submit"]').attr('disabled',false);
				console.log(msg);
				if(msg.errors){
					self.alertView.displayAlert('warning', msg.errors.title, msg.errors.errorCode);
				}else{ // Everything is good
					self.user.connect(msg.user);
					return;
					self.eventBus.trigger('url:change',{url:'#'+urls.HOME});
				}
				
			}, function(msg) { // error
				self.alertView.displayError(msg.status, msg.errorCode);
				this.$('input[type="submit"]').attr('disabled',false);
			});
		}
	});

	// Our module now returns our view
	return ClassView;
}); 