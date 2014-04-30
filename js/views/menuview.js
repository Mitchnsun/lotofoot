// Filename: headerview.js
define(['jquery', 'underscore', 'backbone', 'bootstrap',
				'fmk/templateengine', 'fmk/urls', 'i18n!tmpl/nls/menu',
				'text!tmpl/homepage/rankingwidget.html', 'text!tmpl/menu.html'],
function($, _, Backbone, Bootstrap, te, urls, i18n, RankingTmpl, tmpl) {

  var ClassView = Backbone.View.extend({
    el : $('menu'),
    initialize : function(options) {
      this.user = options.user;
      this.ranking = options.ranking;
      this.user.on('change', this.manageMenu, this); // listen to any change of the model user
    },
    render : function() {
      $(this.el).html(te.renderTemplate(tmpl, {
        i18n : i18n,
        urls : urls
      }));
			
			this.rankingRender();
			
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
    },
    rankingRender : function(){
			var self = this;
			
			$.when(this.ranking.promise).done(function(){
				self.$("#rankingWidget").html(te.renderTemplate(RankingTmpl, {
					ranking : _.first(self.ranking.toJSON(),3)
				}));
			});
		},
		/*
		 * Events
		 */
		events : {
			'click #menuLink' : 'menuToggle'
		},
		menuToggle : function(e){
      e.preventDefault();
      $('#layout').toggleClass('active');
      $('#menu').toggleClass('active');
      $('#menuLink').toggleClass('active');
		}
  });

  // Our module now returns our view
  return ClassView;
});