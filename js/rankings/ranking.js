define(['jquery', 'underscore', 'backbone', 'fmk/lotofootapi', 'rankings/player'],
function($, _, Backbone, LotofootApi, Player) {

	var Collection = Backbone.Collection.extend({
		model : Player,
		default_type : "Overall",
		default_season : 3,
		load : function(options){
		  
			if(options === undefined){ // Default configuration : 2015 -> Overall season 3
				options = {
				  type : this.default_type,
				  season : this.default_season
				};
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
			
			this.reset();
			
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