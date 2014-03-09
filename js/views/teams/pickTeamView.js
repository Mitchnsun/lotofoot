define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'text!tmpl/teams/pickTeam.html',
        'i18n!tmpl/pronos/nls/createprono', 'i18n!nls/country',],
function($, _, Backbone, te, tmpl, i18n, country) {
    
    var ClassView = Backbone.View.extend({
        initialize : function(){
            this.gameType = null; // variable for the type of the game : league, cup, international, etc.
            this.teams = []; // Array with the two teams for the game
            this.games = []; // Array with the created games
            
            this.el = this.options.el;
            this.clubs = this.options.clubs; // List of all the clubs
            this.international = this.options.international; // list of international teams
        },
        render : function() {
            $(this.el).html(te.renderTemplate(tmpl, {
                i18n : i18n,
                clubs : this.clubs,
                international : this.international
            }));
        }
    });
    
    // Our module now returns our view
    return ClassView;
});