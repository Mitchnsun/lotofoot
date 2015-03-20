define(['jquery', 'underscore', 'backbone', 'fmk/lotofootapi', 'fmk/urls'],
function($, _, Backbone, LotofootApi, urls) {

	var Model = Backbone.Model.extend({
		formatData : function() {
			var luckyRatio = parseFloat(this.get('luckyRatio'));
			var prediction = parseFloat(this.get('prediction'));
			var pointByProno = parseFloat(this.get('pointByProno'));
			this.set({
				luckyRatio : luckyRatio.toFixed(2),
				prediction : prediction.toFixed(2),
				pointByProno : pointByProno.toFixed(2)
			});
		}
	}); 

	// Return the model for the module
	return Model;
}); 