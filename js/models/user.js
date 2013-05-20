define(['jquery', 'underscore', 'backbone', 'fmk/lotofootapi'], function($, _, Backbone, LotofootApi) {
	var Model = Backbone.Model.extend({
		defaults : {
			sessionRetrieve : false,
			isConnected : false,
			urlFrom : ""
		},
		/* Authentication */
		connect : function(user) {
			this.set(user);
			this.set({isConnected : true});
		},
		checkAuth : function() {
			return this.get('isConnected');
		},
		retrieveSession : function(){
			var self = this;
			if(typeof localStorage != undefined) {
				this.set({
					userid : localStorage.getItem("userid"),
					sessionid : localStorage.getItem("sessionid"),
					lastLogedIn : localStorage.getItem("lastLogedIn")
				});
				
				this.checkSession();
			}
		},
		checkSession : function(){
			var self = this;
			if(this.get('sessionid') === undefined){
				return false; // if local storage are empty, do not lose time to call a web service
			}
			return this.promise = LotofootApi.checkSession({
				userid : this.get('userid'),
				sessionid : this.get('sessionid'),
				lastLogedIn : this.get('lastLogedIn')
			},function(msg){ // success
				if(msg.sessionRetrieve === true){
					self.set({sessionRetrieve : true});
					self.connect(msg.user);
				}
			},function(){ // error
				/* If they are an error, no need to handle it */
			});
		}
	});
	// Return the model for the module
	return Model;
}); 