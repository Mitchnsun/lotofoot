define(['jquery', 'underscore', 'backbone', 'models/game'],
function($, _, Backbone, Game) {
    
    var Collection = Backbone.Collection.extend({
			model : Game
	});
	// Return the model for the module
	return Collection;
}); 