// Filename: headerview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'text!tmpl/header.html'],
function($, _, Backbone, te, tmpl) {
    
    var ClassView = Backbone.View.extend({
        el : $('header'),
        render : function() {
            $(this.el).html(te.renderTemplate(tmpl, {}));
        }
    });
    
    // Our module now returns our view
    return ClassView;
});