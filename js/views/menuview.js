// Filename: headerview.js
define(['jquery', 'underscore', 'backbone', 'bootstrap',
				'fmk/templateengine', 'fmk/urls', 'i18n!tmpl/nls/menu', 'text!tmpl/menu.html'],
function($, _, Backbone, Bootstrap, te, urls, i18n, tmpl) {

  var ClassView = Backbone.View.extend({
    el : $('menu'),
    initialize : function(options) {
      this.user = options.user;
      this.user.on('change', this.manageMenu, this); // listen to any change of the model user
    },
    render : function() {
      $(this.el).html(te.renderTemplate(tmpl, {
        i18n : i18n,
        urls : urls
      }));

      if (this.user.get('isConnected') === false) {// Hide menu items if the user is not connected
        this.$('#menu ul').hide();
      }
    },
    manageMenu : function() {
      var menuItems = this.$('#menu ul');
      if (this.user.get('isConnected')) {
        menuItems.show();
      } else {
        menuItems.hide();
      }
    },
    menuChange : function(url) {
      this.$('#menu li').removeClass('active');
      this.$('li a[href="#' + url + '"]').parent().addClass('active');
    }
  });

  // Our module now returns our view
  return ClassView;
});