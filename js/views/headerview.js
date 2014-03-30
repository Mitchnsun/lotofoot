// Filename: headerview.js
define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/urls', 'i18n!tmpl/nls/header', 'text!tmpl/header.html'],
function($, _, Backbone, te, urls, i18n, tmpl) {
    
    var ClassView = Backbone.View.extend({
        el : $('header'),
        initialize : function(options){
        	this.user = options.user;
        	this.user.on('change', this.manageNavBar, this); // listen to any change of the model user
        },
        render : function() {
            $(this.el).html(te.renderTemplate(tmpl, {
            	i18n : i18n,
            	urls : urls
           }));
            
            if(this.user.get('isConnected') === false){ // Hide navigation bar if the user is not connected
            	this.$('div.nav-collapse, a.btn-navbar').hide();
            }
        },
        manageNavBar : function(){
        	var menuItems = this.$('div.nav-collapse, a.btn-navbar');
        	if(this.user.get('isConnected')){
            	menuItems.show();
            }else{
            	menuItems.hide();
            }
        },
        menuChange : function(url) {
        	this.$('ul.nav li').removeClass('active');
        	this.$('li a[href="#' + url + '"]').parent().addClass('active');
        }
    });
    
    // Our module now returns our view
    return ClassView;
});