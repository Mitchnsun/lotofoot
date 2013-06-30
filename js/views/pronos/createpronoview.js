define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview',
        'fmk/urls', 'i18n!tmpl/pronos/nls/createprono', 'text!tmpl/pronos/createprono.html'],
function($, _, Backbone, te, LotofootApi, AlertView, urls, i18n, tmpl) {

    var ClassView = Backbone.View.extend({
        el : $('#container'),
        initialize : function() {
            this.user = this.options.user;
            this.alertView = new AlertView();
        },
        render : function() {
            var self = this;
            $(this.el).html(te.renderTemplate(tmpl, {
                i18n : i18n,
                urls : urls
            }));
        },
        /*
         * Events of the view
         */
        events : {

        }
    });

    // Our module now returns our view
    return ClassView;
});