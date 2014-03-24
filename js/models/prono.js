define(['jquery', 'underscore', 'backbone'],
function($, _, Backbone) {
    
    var Model = Backbone.Model.extend({
		defaults : {
			id : 0,
			userid : 0,
			player : 'Nemo',
			id_game : 0,
			scoreA : 0,
			scoreB : 0,
			date : '',
			time : '',
			timestamp : 0
		},
		setData : function(item){
			var name = item.by.firstname + ' ' + item.by.lastname;
			this.set({
				id : item.id_prono,
				userid : item.by.userid,
				player : name,
				id_game : item.id_game,
				scoreA : item.scoreA,
				scoreB : item.scoreB,
				date : item.prono_date,
				time : item.prono_time,
				timestamp : item.timestamp
			});
		}
	});
	// Return the model for the module
	return Model;
}); 