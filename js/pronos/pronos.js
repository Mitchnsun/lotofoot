define(['jquery', 'underscore', 'backbone', 'pronos/prono'],
function($, _, Backbone, Prono) {
    
    var Collection = Backbone.Collection.extend({
			model : Prono
	});
	// Return the model for the module
	return Collection;
}); 