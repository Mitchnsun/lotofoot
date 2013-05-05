// Filename: homepageview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/errorsview', 'text!tmpl/homepage.html'],
function($, _, Backbone, te, LotofootApi, ErrorsView, tmpl) {
	
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function(){
		  this.errorsView = new ErrorsView(); 
		},
		render : function() {
		    var self = this;
			$(this.el).html(te.renderTemplate(tmpl, {title : "Lotofoot"}));
			
			LotofootApi.test({title : 'lotofoot'}, function(msg){
			    //success
			},function(msg){
			    self.errorsView.displayError(msg.status, msg.errorCode);
			});
		}
	});
	
	// Our module now returns our view
	return ClassView;
});
