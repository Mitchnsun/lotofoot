define(['jquery', 'underscore', 'backbone',
		'fmk/templateengine', 'fmk/lotofootapi', 'fmk/urls',
		'i18n!nls/wordings',
		'text!account/create.html'],
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
			$(this.el).html(te.renderTemplate(tmpl, {i18n : i18n.account}));
			
			if(this.browserStorage.get('hasLocalStorage') === false){ // Display a message if the browser can't use localStorage
				this.browserStorage.noSupport(this.alertview, i18n.account.WebStorageLogin);
				this.$('label.checkbox').remove();
			}
		},
		/*
		 * Events of the view
		 * submitLogIn : submit the form to log in, check if the input are filled, call WS and make the redirection
		 */
		events : {
			"submit" : "submitSignIn"
		},
		submitSignIn : function(e){
			e.preventDefault();// cancel all actions linked to this click
			this.$('input[type="submit"]').attr('disabled',true);
			
			var self = this;
			var params = {};
			var errors = [];
			var inputs = this.$('input.data');
			
			_.each(inputs, function(input){
				params[self.$(input).attr('name')] = self.$(input).val();
			});

			// Check value
			if(params.email === '' || !i18n.account.regexEmail.test(params.email)){
				errors.push('email');
			}
			
			if(params.pseudo == "" && (params.firstname == "" || params.lastname == "")){
				errors.push('username');
			}
			
			if (errors.length > 0) {// Display errors if they exist
				this.displayErrors(errors);
				this.$('input[type="submit"]').attr('disabled',false);
				return;
			}

			LotofootApi.newAccount(params, function(msg) { // success
				self.alertview.dismissAlert();
				self.$('input[type="submit"]').attr('disabled',false);
				
				if(msg.errors.length > 0){
					self.displayErrors(msg.errors);
				}else {
					var username = params.pseudo != ''? params.pseudo:params.firstname;
					self.eventBus.trigger('url:change',{url:'#' + urls.LOGIN + '/welcome/' + username});
				}
			}, function(msg) { // error
				self.alertview.displayError(msg.status, msg.errorCode);
				self.$('input[type="submit"]').attr('disabled',false);
			});
		},
		displayErrors : function(errors){
			var errorMessage = "";
			_.each(errors,function(key){
				errorMessage += i18n.account.errors[key] + " ";
			});
			this.alertview.displayAlert('warning', 'default', errorMessage);
		}
	});

	// Our module now returns our view
	return ClassView;
}); 