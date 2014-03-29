define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'i18n!tmpl/fmk/nls/alert', 'text!tmpl/fmk/alert.html'], function($, _, Backbone, te, i18n, tmpl) {

    var ClassView = Backbone.View.extend({
        el : $('#container'),
        render : function(type) {
            this.dismissAlert();
            $(this.el).prepend(te.renderTemplate(tmpl, {
                type : type,
                msg : this.msg
            }));
        },
        /*
         * displayError : error messages are displayed with a status (ex: 500) and a code
         */
        displayError : function(status, code) {
            this.msg = {
                "Title" : i18n.default_Title
            };

            if (status) {
                this.msg.status = i18n[status];
            }
            if (code) {
                this.msg.message = i18n[code];
            } else {
                this.msg.message = this.getMessage(status);
            }

            var type = this.setType('error');

            this.render(type);
        },
        /*
         * Three type of alert : success, info and warning (default).
         * code is for the message to display.
         */
        displayAlert : function(type, title, msg) {
            if (i18n[title + "_Title"] !== undefined) {
                this.msg = {
                    "Title" : i18n[title + "_Title"]
                };
            } else {
                this.msg = {
                    "Title" : title
                };
            }

            if (msg) {
                this.msg.message = msg;
            }

            type = this.setType(type);

            this.render(type);
        },
        getMessage : function(status) {
            return i18n['message_' + status];
        },
        setType : function(type) {// add the specific class to the alert bloc
            switch(type) {
                case 'error':
                    return 'alert-error';
                case 'success':
                    return 'alert-success';
                case 'info':
                    return 'alert-info';
                default:
                    return '';
            }
        },
        /*
         * Events of the view
         * dismissAlert : function to remove the alert from DOM
         */
        events : {
            'click .close' : 'dismissAlert'
        },
        dismissAlert : function(e) {
            if (e !== undefined) {
                e.preventDefault();
            }
            this.$('.AlertView').remove();
        },
        /*
         * Unbind : the view is removed from the DOM
         */
        unbind : function(){
        	this.undelegateEvents();
        }
    });

    // Our module now returns our view
    return ClassView;
}); 