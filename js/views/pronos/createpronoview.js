define(['jquery', 'underscore', 'backbone', 'fmk/templateengine', 'fmk/lotofootapi', 'fmk/alertview',
        'fmk/urls', 'i18n!tmpl/pronos/nls/createprono', 'i18n!nls/country', 'text!tmpl/pronos/createprono.html'],
function($, _, Backbone, te, LotofootApi, AlertView, urls, i18n, country, tmpl) {

    var ClassView = Backbone.View.extend({
        el : $('#container'),
        initialize : function() {
            this.user = this.options.user;
            this.alertView = new AlertView();
            
            this.gameType = null; // variable for the type of the game : league, cup, international, etc.
            this.teams = []; // Array with the two teams for the game
            this.clubs = {}; // List of all the clubs
            this.international = {}; // list of international teams
            
            // Bind functions to the view
            // By default, they bind to the window because they are function callbacks 
            this.successGetTeamsCallback = _.bind(this.successGetTeams, this);
        },
        render : function() {
            var self = this;
            
            LotofootApi.getTeams({}, this.successGetTeamsCallback, function(msg){// error
                console.log(msg); // TODO : manage errors
            });
        },
        /*
         * Success of getTeams WS
         */
        successGetTeams : function(msg){
            this.clubs = msg.clubs;
            this.international = msg.international;
            var clubsList = [];

            _.each(msg.clubs, function(item){ // fetch the right name of the country
                item.name = country[item.id];
                clubsList.push(item);
            });

            _.each(msg.international, function(item){ // Function for the multi-lingual, the database is in French
                item.name = country[item.country];
            });
            
            // Rendering the view
            $(this.el).html(te.renderTemplate(tmpl, {
                i18n : i18n,
                urls : urls,
                clubs : clubsList,
                international : this.international
            }));
        },
        /*
         * Events of the view
         */
        events : {
            "click #SelectGame a" : "kindOfGame",
            "click #Clubs a.country" : "selectCountry",
            "click a.club" : "pickATeam",
            "click a.international" : "pickANationalTeam"
        },
        kindOfGame : function(e){ // Pick the type of the game to bet
            e.preventDefault();
            this.gameType = this.$(e.currentTarget).attr('ref');
            
            this.$("#SelectGame").addClass('hide');
            // Display the right list in terms of the choice
            if(this.gameType == i18n.ref_international_game){
                this.$('#International').removeClass('hide');
            }else{
                this.$('#Clubs').removeClass('hide');
            }
        },
        selectCountry : function(e){ // Pick the country where the clubs are from
            e.preventDefault();
            var ref = this.$(e.currentTarget).attr('ref');
            var $selectedCountry = this.$(e.currentTarget).parent();
            $selectedCountry.removeClass('span3').addClass('span12');
            
            var $listCountry = this.$("#Clubs > div.span3");
            $listCountry.addClass('hide'); // Hide the other country
            
            $selectedCountry.find('div.row.hide').removeClass('hide');
        },
        pickATeam : function(e){ // Pick a team
            e.preventDefault();
            
            if(this.teams.length >= 2){ // A game cannot have more than two teams !
                return false;
            }
            
            /* Initialize variables */
            var $element = this.$(e.currentTarget);
            var ref = $element.attr('ref');
            var country = $element.attr('data-country');
            var $selectedCountry = $element.parents('div.span12');
            var $listCountry = this.$("#Clubs > div.span3");
            var team = this.getTeamInfos(ref,country);
            
            if(this.gameType == i18n.ref_league_game || this.gameType == i18n.ref_cup_game){
                this.teams.push(team);
            }
            else if(this.gameType == i18n.ref_europa_game){
                this.teams.push(team);
                $selectedCountry.find('div.row').addClass('hide');
                $selectedCountry.removeClass('span12').addClass('span3');
                $listCountry.removeClass('hide');
            }
            else{
                // TODO : Display errors
            }
            console.log(this.teams);
        },
        pickANationalTeam : function(e){
            e.preventDefault();
            
            if(this.teams.length >= 2){ // A game cannot have more than two teams !
                return false;
            }
            
            var ref = this.$(e.currentTarget).attr('ref');
            var nation = {};
            
            _.every(this.international,function(item){
                if(item.id == ref){
                    nation = item;
                    return false;
                }
                return true;
            });
            
            if(this.gameType == i18n.ref_international_game){
                this.teams.push(nation);
            }else{
                // TODO : Display errors
            }
            
            console.log(this.teams);
        },
        /*
         * Tools functions
         */
        getTeamInfos : function(id,country){ // return the all the infos of the team in an object
            var team = {};
            var array = this.clubs[country].recs;
            
            _.every(array,function(club){
                if(club.id == id){
                    team = club;
                    return false;
                }
                return true;
            });
            
            return team;
        }
    });

    // Our module now returns our view
    return ClassView;
});