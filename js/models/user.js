define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Model = Backbone.Model.extend({
		defaults : {
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
		}
	});
	// Return the model for the module
	return Model;
}); 