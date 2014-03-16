define(['jquery', 'underscore', 'backbone'],
function($, _, Backbone) {
    
    var Model = Backbone.Model.extend({
		defaults : {
			hasLocalStorage : false,
			hasSessionStorage : false,
			localStorage : "",
			sessionStorage : ""
		},
		initialize : function(){
			if(typeof localStorage != undefined) {
				this.set('hasLocalStorage',true);
			}
			if(typeof sessionStorage != undefined) {
				this.set('hasSessionStorage',true);
			}
		},
		noSupport : function(alertView, msg){
			alertView.displayAlert('info', 'info', msg);	
		}
	});
	// Return the model for the module
	return Model;
}); 