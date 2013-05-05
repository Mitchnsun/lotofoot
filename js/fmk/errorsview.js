define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'i18n!tmpl/nls/errors', 'text!tmpl/errors.html'],
function($, _, Backbone, te, i18n, tmpl) {
    
    var ClassView = Backbone.View.extend({
        el : $('#container'),
        render : function() {
            $(this.el).prepend(te.renderTemplate(tmpl, {msg : this.msg}));
        },
        displayError : function(status, code){
            this.msg = {"Title" : i18n.Title};
            this.msg.status = i18n[status];
            if(code !== undefined){
                this.msg.message = i18n[code];
            }
            
            this.render();
        },
        /*
         * Events of the view
         * dismissAlert : function to remove the alert from DOM
         */
        events : {
            'click .close' : 'dismissAlert'
        },
        dismissAlert : function(e){
            e.preventDefault();
            this.$('.ErrorsView').remove();
        }
    });
    
    // Our module now returns our view
    return ClassView;
});