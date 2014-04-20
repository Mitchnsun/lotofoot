define(['jquery', 'underscore', 'backbone', 'fmk/lotofootapi', 'models/player'],
function($, _, Backbone, LotofootApi, Player) {

	var Collection = Backbone.Collection.extend({
		model : Player,
		load : function(options){
			if(options === undefined){ // Default configuration : 2014 -> Overall season 2
				options = {};
			}
			
			// Bind functions to the view
      // By default, they bind to the window because they are callback functions
      this.rankingCallback = _.bind(this.createRanking, this);
			
			return this.promise = LotofootApi.getRanking(options, this.rankingCallback, function(msg){
				console.log(msg); // TODO : manage errors
			});
		},
		createRanking : function(data){
			var self = this;
			
			_.each(data.users, function(user){
				if(user.total > 0){
					var player = new Player();
					player.set(user);
					player.formatData();
					self.add(player);
				}
			});
		}
	}); 

	// Return the model for the module
	return Collection;
}); 