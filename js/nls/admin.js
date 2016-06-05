define({
	/* Please sort alphabetically */
	"root" : {
		"admin_games_title" : "Gestion des matchs",
		"admin_ranking_title" : "Gestion des classements",
		"new_game" : "Créer un match",
		"title" : "Console d'administration",

		/* Classement*/
		"createranking" : "Création du classement",
		"pronosscores" : "Attribution des points",
		"pronosvalidation" : "Validation des pronostics",
		"run_ranking" : "Créer le classement",
		"setrank" : "Attribution des places",

		"competitions" : ["Overall", "French-L1", "Europa", "International"],
		"seasons" : [{
			"id" : 3,
			"startDate" : "25/07/2014",
			"endDate" : "01/06/2015"
		}, {
			"id" : 2,
			"startDate" : "01/07/2013",
			"endDate" : "01/06/2014"
		}, {
			"id" : 1,
			"startDate" : "01/07/2012",
			"endDate" : "01/06/2013"
		}],

		create_games : {
			title : "Ajouter un match",
			Add : "Ajouter",
			placeholderSchedule : "JJ/MM/AAAA",

			clubs : "Clubs",
			international : "Equipes nationales",

			select_game : "Sélectionnez le type du match",
			league_game : "Match de championnat",
			ref_league_game : "league",
			cup_game : "Match de Coupe nationale",
			ref_cup_game : "cup",
			europa_game : "Match de Coupe européenne",
			ref_europa_game : "europa",
			international_game : "Match international",
			ref_international_game : "international",

			/* Competitions translations */
			"CM2014" : "Coupe du Monde 2014",
			"Friendly" : "Amical",
			"French-L1" : "Ligue 1",
			"UEFA-CL" : "Champions League",
			"UEFA-EL" : "Europa League",
			"French-Cup" : "Coupes françaises",
			"Groups" : "Phase de groupes",
			"Last16" : "8ième de finale",
			"Last8" : "Quarts de finale",
			"Semi" : "Demi-finale",
			"Final" : "Finale",

			/* Select List */
			hours : [20, 21, 22, 23, 14, 15, 16, 17, 18, 19, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
			minutes : ['00', '05', 15, 30, 45],
			competitions : ["French-L1", "UEFA-CL", "UEFA-EL", "French-Cup", "Friendly", "EURO2016"],
			"stage_CM2014" : ["Groups", "Last16", "Last8", "Semi", "ThirdPlace", "Final"],
			"stage_EURO2016" : ["Qualification", "Playoff", "Groups", "Last16", "Last8", "Semi", "ThirdPlace", "Final"],
			"stage_French-L1" : [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
			"stage_UEFA-CL" : ["Round1", "Round2", "Round3", "Playoff", "Groups", "Last16", "Last8", "Semi", "Final"],
			"stage_UEFA-EL" : ["Round1", "Round2", "Round3", "Playoff", "Groups", "Last32", "Last16", "Last8", "Semi", "Final"],

			/* Alert messages */
			add_success : "Merci, vos matchs ont bien été ajoutés et vous pouvez pronostiquer en retournant à l'accueil.",
			empty_games : "Vous devez créer des matchs avant de pouvoir les ajouter.",
			wrong_schedule : "La date d'un match ne peut être nulle, merci de bien vouloir remplir une date correcte."
		}
	}
});