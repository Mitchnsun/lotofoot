define(['jquery', 'underscore', 'backbone', 'fmk/lotofootapi', 'fmk/urls'],
function($, _, Backbone, LotofootApi, urls) {

	var Model = Backbone.Model.extend({
		initialize : function() {

		}
	}); 

	// Return the model for the module
	return Model;
}); 