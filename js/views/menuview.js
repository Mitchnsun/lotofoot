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
        urls : urls,
        user : this.user.toJSON()
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
        this.render();
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
					user : self.user.toJSON(),
					ranking : self.getRankingsForWidget()
				}));
			});
		},
		getRankingsForWidget : function(){
			var current = this.ranking.findWhere({userid : this.user.get('userid')});
			if(current != undefined){
				current = current.toJSON();
			} else { // No ranking for the user, show the podium
				return _.first(this.ranking.toJSON(),3);
			}
			
			var previousRank = parseInt(current.rank,10) - 1;
			var nextRank = parseInt(current.rank,10) + 1;
			
			var previous = this.ranking.findWhere({rank : JSON.stringify(previousRank)});
			previous = previous!=undefined?previous.toJSON():{};
			var next = this.ranking.findWhere({rank : JSON.stringify(nextRank)});
			next = next!=undefined?next.toJSON():{};
			
			if(parseInt(current.rank,10) == 1){ // user is first
				var nextAfterRank = parseInt(current.rank,10) + 2;
				var nextAfter = this.ranking.findWhere({rank : JSON.stringify(nextAfterRank)});
				nextAfter = nextAfter!=undefined?nextAfter.toJSON():{};
				return [current, next, nextAfter];
			}
			
			if(parseInt(current.rank,10) == this.ranking.length){ // user is last
				var beforePreviousRank = parseInt(current.rank,10) - 2;
				var beforePrevious = this.ranking.findWhere({rank : JSON.stringify(beforePreviousRank)});
				beforePrevious = beforePrevious!=undefined?beforePrevious.toJSON():{};
				return [beforePrevious, previous, current];
			}
			
			return [previous, current, next];
		},
		/*
		 * Events
		 */
		events : {
			'click #menuLink' : 'menuToggle',
			'click #menu a' : 'closeMenu'
		},
		menuToggle : function(e){
      e.preventDefault();
      this.closeMenu(e);
		},
		closeMenu : function(e){
			$('#layout').toggleClass('active');
      $('#menu').toggleClass('active');
      $('#menuLink').toggleClass('active');
		}
  });

  // Our module now returns our view
  return ClassView;
});