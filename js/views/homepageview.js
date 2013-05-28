// Filename: homepageview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'text!tmpl/homepage.html'],
function($, _, Backbone, te, LotofootApi, AlertView, tmpl) {

    var ClassView = Backbone.View.extend({
        el : $('#container'),
        initialize : function() {
        	this.user = this.options.user;
            this.alertView = new AlertView();
        },
        render : function() {
            var self = this;
            $(this.el).html(te.renderTemplate(tmpl, {
                title : "Lotofoot"
            }));
        },
        /*
		 * Events of the view
		 */
		events : {

		},
    });

    // Our module now returns our view
    return ClassView;
});
