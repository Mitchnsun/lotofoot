define(['jquery', 'underscore', 'backbone', 'games/game'],
function($, _, Backbone, Game) {
    
    var Collection = Backbone.Collection.extend({
			model : Game
	});
	// Return the model for the module
	return Collection;
}); 