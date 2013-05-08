// Filename: headerview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'i18n!tmpl/nls/header', 'text!tmpl/header.html'],
function($, _, Backbone, te, i18n, tmpl) {
    
    var ClassView = Backbone.View.extend({
        el : $('header'),
        render : function() {
            $(this.el).html(te.renderTemplate(tmpl, {i18n : i18n}));
        }
    });
    
    // Our module now returns our view
    return ClassView;
});