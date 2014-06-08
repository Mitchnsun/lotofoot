define(['jquery', 'underscore', 'backbone',
        'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
        'i18n!tmpl/pronos/nls/pronos', 'i18n!nls/country', 'text!tmpl/pronos/toppronos.html'],
function($, _, Backbone, te, LotofootApi, AlertView, urls, i18n, country, tmpl)
{
  var ClassView = Backbone.View.extend({
    el : $('#container'),
    initialize : function(options) {
      this.user = options.user;
      this.teams = options.teams;
      this.alertView = new AlertView();
    },
    render : function() {
      $(this.el).html(te.renderTemplate(tmpl, {
        i18n : i18n,
        urls : urls
      }));
    },
    /*
     * Events
     */
    events : {}
  });

  // Our module now returns our view
  return ClassView;
}); 