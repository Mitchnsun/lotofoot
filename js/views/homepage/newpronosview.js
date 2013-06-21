define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview',
        'i18n!tmpl/homepage/nls/newpronos', 'text!tmpl/homepage/newpronos.html'],
function($, _, Backbone, te, LotofootApi, AlertView, i18n, tmpl) {

    var ClassView = Backbone.View.extend({
        initialize : function() {
            this.user = this.options.user;
            this.el = this.options.el;
            this.alertView = new AlertView();
        },
        render : function() {
            var self = this;

            LotofootApi.getNewPronos({
                userid : this.user.get('userid')
            }, function(msg) {// success
            	console.log(msg);
                if(msg.pronos.length > 0){
                    $(self.el).html(te.renderTemplate(tmpl, {
                        i18n : i18n
                    }));  
                }
            }, function(msg) {// error
                self.alertView.displayError(msg.status, msg.errorCode);
            });
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