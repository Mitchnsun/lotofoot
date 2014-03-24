define(['jquery', 'underscore', 'backbone'],
function($, _, Backbone) {
    
    var Model = Backbone.Model.extend({
		defaults : {
			userid : 0,
			player : 'Nemo',
			scoreA : 0,
			scoreB : 0
		},
		initialize : function(){}
	});
	// Return the model for the module
	return Model;
}); 