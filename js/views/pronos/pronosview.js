define(['jquery', 'jqueryUI', 'underscore', 'backbone',
				'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview', 'fmk/urls',
				'i18n!tmpl/pronos/nls/pronos', 'i18n!nls/country', 'text!tmpl/pronos/pronos.html'],
function($, $UI, _, Backbone,	te, LotofootApi, AlertView, urls, i18n, country, tmpl)
{
	var ClassView = Backbone.View.extend({
		el : $('#container'),
		initialize : function() {
			this.user = this.options.user;
			this.teams = this.options.teams;
			this.alertView = new AlertView();
		},
		render : function() {
			var self = this;

			$(this.el).html(te.renderTemplate(tmpl, {
				i18n : i18n,
				urls : urls
			}));
		}
	});

	// Our module now returns our view
	return ClassView;
}); 