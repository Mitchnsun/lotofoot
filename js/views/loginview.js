define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls', 'text!tmpl/login.html'],
function($, _, Backbone, te, LotofootApi, AlertView, urls, tmpl) {

	var ClassView = Backbone.View.extend({
		initialize : function() {
			this.user = this.options.user;
			this.eventBus = this.options.eventBus;
			
			this.alertView = new AlertView();
		},
		el : $('#container'),
		render : function() {
			$(this.el).html(te.renderTemplate(tmpl, {}));
		},
		/*
		 * Events of the view
		 * submitLogIn : submit the form to log in, check if the input are filled
		 */
		events : {
			"submit" : "submitLogIn"
		},
		submitLogIn : function(e) {
			e.preventDefault();// cancel all events linked to this click
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
				return;
			}

			LotofootApi.login({
				userEmail : inputEmail.val(),
				userPwd : inputPwd.val()
			}, function(msg) { // success
				self.alertView.dismissAlert();
				
				if(msg.errors){
					self.alertView.displayAlert('warning', msg.errors.title, msg.errors.errorCode);
				}else{ // Everything is good
					self.user.connect(msg.user, msg.sessionid);
					self.eventBus.trigger('url:change',{url:'#'+urls.HOME});
				}
				
			}, function(msg) { // error
				self.alertView.displayError(msg.status, msg.errorCode);
			});
		}
	});

	// Our module now returns our view
	return ClassView;
}); 