define({
	/* Please sort alphabetically */
	"root" : {
	  LotofootStartingYear : 2012,
		alert : {
			"default_Title" : "Attention!",
			"info_Title" : "Information,",
			"success_Title" : "Succès,",
	
			/* Alert Error */
			"401" : "401 : Une authentification est nécessaire pour accéder à la ressource.",
			"403" : "403 : Cette ressource est interdite d'accès.",
			"404" : "404 : Ressource non trouvée.",
			"422" : "422 : L’entité fournie avec la requête est incompréhensible ou incomplète.",
			"500" : "500 : Erreur interne du serveur",
	
			"message_500" : "Si cette erreur persiste, n'hésitez pas à contacter le webmaster",
	
			"BD" : "La base de données est actuellement indisponible, veuillez nous excuser du désagrément. Réessayez ultérieurement, si l'erreur persiste n'hésitez pas à contacter le webmaster.",
			"BDLogin" : "Une erreur s'est produite lors de votre identification, la base de données est actuellement indisponible, veuillez nous excuser du désagrément. Réessayez ultérieurement, si l'erreur persiste n'hésitez pas à contacter le webmaster.",
			"JSON" : "Une erreur est survenue dans la lecture des données reçues depuis le serveur. Réessayez ultérieurement, si l'erreur persiste n'hésitez pas à contacter le webmaster.",
			"Wrong_User" : "Il semblerait que vous tenteriez d'accéder à des informations qui ne sont pas liées à votre compte, recharger la page pour vous connecter.",
			"data_forbidden" : "Le temps imparti pour utiliser cette ressource a surement été dépassé. La modification n'a pas été prise en compte.",
			"data_existence" : "Les informations que vous essayez d'accéder ne semblent pas exister. La modification n'a pas été prise en compte."
		},
		menu : {
			"admin" : "Admin",
			"blog" : "Blog",
			"home" : "Accueil",
			"new_game" : "Créer un match",
			"pronos" : "Pronostics",
			"ranking" : "Classement",
			"title" : "Lotofoot",
			"worldcup" : "CM 2014",
			"euro" : "EURO 2016"
		},

		homepage : {
			currentGames_title : "Match en cours",
			loading_NewPronos : "Nous recherchons les pronostics disponibles...",
			
			"title" : "Pronostics en cours",
			"no_pronos" : "Aucun pronostic n'est en cours.",
			
			/* Alert Success */
			"AddProno" : "Votre pronostic a été enregistré",
			"updateProno" : "Votre pronostic a été mis à jour",
			
			alertTopPronosMessage : "Pour vous faire une idée de qui finira dans le dernier carré,"
		     + " vous pouvez simuler la Coupe du Monde "
		     + "<a href='http://www.sports.fr/football/coupe-du-monde-2014/world-cup-simulator/' target='_blank'>ici</a>"
		     + "<br/>Il est possible de parier jusqu'au 17 juin 2014 23h59.",
		  alertTopPronosTitle : "Informations,",
		  bet : "Parier",
		  getTopPronosIncoming : "Le module de visualisation des pronostics des autres joueurs est encore en cours de construction. Il devrait arriver sans tarder."
		   + " Merci de votre patience.",
		  player : "Joueur",
		  pronos : "Pronostics",
			
			/* Errors */
			teamsBonus_errorMsg : "Vous devez impérativement sélectionner pour chaque position. Si vous n'avez aucune idée, choissisez au hasard peut être que la chance vous sourira",
			timeBonus_errorMsg : "Le temps imparti pour ce pari est passé. Les résultats arriveront à la fin de la compétition."
		},
		
		authentication : {
			"alertTitle" : "Pas de compte ?",
			"email" : "Email",
			"login" : "Se connecter",
			"new_account_message" : "Il n'y a pas de problème, créez-en un",
			"password" : "Mot de passe",
			"remember" : "Se souvenir de moi",
			"welcome_message" : "Félicitation d'avoir rejoint la communauté des pronostiqueurs du Lotofoot. Ici un seul crédo : le sport. "
				+ "Le principe du Lotofoot est de pronostiquer le score exact du match, c'est un tout-pile. Après chaque match un classement est effectué en fonction des pronostics. "
				+ "<ul><li>Score exact : 3 points</li><li> Issue correct : 1 point, ex : vous avez pronostiqué un match nul mais le score n'était pas correct</li>"
				+ "<li>Sinon 0 points</li><li>Un tout-pile en finale rapporte 5 points</li></ul>"
				+ "<br/>Pronostiquer, partager, vibrer !"
				+ "<br/>Connectez vous et démarrez l'expérience!",
			"welcomeTitle" : "Bienvenue",
			
			/* Alert Warning */
			"EmptyLogIn" : "L'email et le mot de passe ne peuvent être vides, veuillez les compléter.",
			"IncorrectLogin" : "Vos identifiants sont incorrects, veuillez les corriger.",
			"NoSessionFound" : "Aucune session n'a été trouvée, veuillez vous connecter.",
			"WebStorageLogin" : "Votre navigateur est obsolète et ne supporte par certaines fontionnalités pour vous connecter. Votre expérience utilisateur risque d'être altérée.<br/>Vous pouvez tout de même vous connecter mais votre session ne pourra être enregistrée. Pour une meilleure expérience, mettez à jour votre navigateur."
		},
		
		account : {
			"alertTitle" : "Informations",
			"email" : "Email",
			"firstname" : "Prénom",
			"lastname" : "Nom",
			"login" : "Se connecter",
			"password" : "Mot de passe",
			"pseudo" : "Pseudonyme",
			"remember" : "Se souvenir de moi",
			"signin" : "S'inscrire",
			
			"regexEmail" : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			
			"errors" : {
				"email" : "Votre email doit être valide pour pouvoir vous inscrire. Exemple : lotofoot@mcomper.at.",
				"email_exists" : "Cet email est déjà utilisé, veuillez entrer un email différent.",
				"username" : "Pour avoir un identifiant sur le site, vous avez besoin soit d'un pseudonyme ou de votre nom/prénom.",
				"username_exists" : "Ce pseudonyme est déjà utilisé, veuillez entrer un pseudonyme différent."
			},
			
			/* Alert Infos */
			"message" : "A minima, il faut un email valide et un pseudonyme. Par sécurité, on vous conseille de mettre un mot de passe.<br/>"
			  + "Vous pouvez ajouter votre nom et prénom, dans ce cas là le pseudonyme n'est pas obligatoire. Par défaut votre pseudonyme sera votre nom public sur le site.<br/>"
			  + "Le Lotofoot vous souhaite d'agréables pronostics!",
			/* Alert Warning */
			"EmptyLogIn" : "L'email et le mot de passe ne peuvent être vides, veuillez les compléter.",
			"IncorrectLogin" : "Vos identifiants sont incorrects, veuillez les corriger.",
			"NoSessionFound" : "Aucune session n'a été trouvée, veuillez vous connecter.",
			"WebStorageLogin" : "Votre navigateur est obsolète et ne supporte par certaines fontionnalités. "
				+ "Votre expérience utilisateur risque d'être altérée.<br/>"
				+ "Vous pouvez tout de même vous inscrire. "
				+ "Pour une meilleure expérience, mettez à jour votre navigateur."
		},
		
		pronos : {
		  alertTopPronosMessage : "Pour vous faire une idée de qui finira dans le dernier carré,"
		     + " vous pouvez simuler la Coupe du Monde "
		     + "<a href='http://www.sports.fr/football/coupe-du-monde-2014/world-cup-simulator/' target='_blank'>ici</a>"
		     + "<br/>Il est possible de parier jusqu'au 17 juin 2014 23h59.",
		  alertTopPronosTitle : "Informations,",
		  bet : "Parier",
		  getTopPronosIncoming : "Le module de visualisation des pronostics des autres joueurs est encore en cours de construction. Il devrait arriver sans tarder."
		   + " Merci de votre patience.",
		  player : "Joueur",
		  pronos : "Pronostics",
		  success : "Votre pari a été enregistré, il peut être modifié à tout moment jusqu'au 17 juin.",
			title : "Derniers pronostics",
			
			/* Errors */
			teams_errorMsg : "Vous devez impérativement choisir quatre équipes. Si vous n'avez aucune idée, choissisez au hasard peut être que la chance vous sourira",
			time_errorMsg : "Le temps imparti pour ce pari est passé. Les résultats arriveront après la finale, le 13 juillet 2014."
		},
		// Top pronos
		tops : {
		  first_txt : "Vainqueur",
      second_txt : "Dauphin",
      third_txt : "Troisième",
      fourth_txt : "Quatrième",
      fifth_txt : "Cinquième",
      top : "Top",
      "top_French-L1" : "Ligue 1",
      top_WC : "Coupe du monde",
      top_EURO : "Euro",
      toppronos : "Top Pronos",
      topPronosMessage : "Choissisez soigneusement les équipes de ce top."
          + " Une bonne place vaudra 5 points, la sélection d'une équipe présente dans le top mais à la mauvaise place vaudra 1 points."
          + " Si vous avez déjà parié, votre pari sera mis automatiquement à jour avec le nouveau.",
      success : "Votre pari a été enregistré, il peut être modifié à tout moment jusqu'au 15 juin."
		},
		rankings : {
			bonus : "B",
		  captionTitle : "Légende,",
		  captionMsg : "<ul>"
		   + "<li> V : victoire, score exact pronostiqué - tout-pile. (3 points)</li>"
		   + "<li> N : issue du match correcte pronostiqué mais le score était inexact. (1 point)</li>"
		   + "<li> D : défaite, le pronostic est raté, mauvaise issue mauvais score. (0 point)</li>"
		   + "<li> B : points bonus</li>"
		   + "<li> Prédiction : pourcentage de pronostics corrects (V+N). </li>"
		   + "<li> Cocu Ratio : pourcentage de tout pile par rapport aux nombres d'issues correctes trouvées."
		   + "</ul>",
		  CM2014 : "Coupe du monde 2014 - Brésil",
		  EURO2016 : "Euro 2016 - France",
			draw : "N",
			infosTitle : "Informations,",
			infosMsg : "Le classement pour la coupe du monde 2014 n'est pas encore disponible. "
				+ "Il apparaitra après le match d'ouverture en fonction des différents pronostics. "
				+ "Ce sera un nouveau classement, le tableau ci-dessous sera réinitialisé.",
			last_update : "Dernière mise à jour",
			loss : "D",
			luckyRatio : "Cocu Ratio",
			no_update : "Aucune",
			player : "Joueur",
			prediction : "Prédiction %",
			score : "Score",
			season : 'Saison',
			seasons : {
				"1" : "2012/2013",
				"2" : "2013/2014",
				"3" : "2014/2015",
				"4" : "2015/2016",
				"5" : "2016/2017"
			},
			title : "Classement",
			types : {
				"Overall" : "Overall",
				"French-L1" : "Ligue 1",
				"Europa" : "Matchs Européens",
				"International" : "Matchs Internationaux"
			},
			total : "Total",
			win : "V"
		},
		worldcup : {
		  "alertMessage" : "Vous pouvez jusqu'au 17 juin 2014 pronostiquer sur les quatre équipes "
		     + "qui atteindront les demi-finales. Vous pourrez choisir le gagnant, le finaliste et le troisième. A vos paris à cette adresse :",
		  "alertTitle" : "Pronostiquez sur le dernier carré !",
		  "Final" : "Finale",
			"group" : "Groupe",
			"Last8" : "Quart de finale",
			"Last16" : "Huitième de finale",
			"nav_groups" : "Groupes",
			"nopronos" : "Il n'y a aucun pronostic en cours pour ce groupe",
			"official_website" : "http://fr.fifa.com/worldcup/",
			"playoff" : "Phase finale", 
			"prono" : "Pronostics",
			"Semi" : "Demi-finales",
			"ThirdPlace" : "Petite Finale",
			"title" : "Coupe du monde 2014 - Brésil",
			
			/* Groups */
      "groups" : [{
        "id" : "A",
        "idTeams" : ["29","114","121","122"]
      },{
        "id" : "B",
        "idTeams" : ["30","24","123","93"]
      },{
        "id" : "C",
        "idTeams" : ["124","125","126","127"]
      },{
        "id" : "D",
        "idTeams" : ["31","128","28","25"]
      },{
        "id" : "E",
        "idTeams" : ["78","102","22","129"]
      },{
        "id" : "F",
        "idTeams" : ["27","130","131","132"]
      },{
        "id" : "G",
        "idTeams" : ["23","101","133","134"]
      },{
        "id" : "H",
        "idTeams" : ["135","136","137","138"]
      }],
			
			/* Alert Success */
	    "AddProno" : "Votre pronostic a été enregistré",
	    "updateProno" : "Votre pronostic a été mis à jour"
		},
		euro : {
		  "alertMessage" : "Vous pouvez jusqu'au 15 juin 2016 pronostiquer sur les quatre équipes "
         + "qui atteindront les demi-finales. Vous pourrez choisir le gagnant, le finaliste et le troisième. A vos paris à cette adresse :",
      "alertTitle" : "Pronostiquez sur le dernier carré !",
      "Final" : "Finale",
      "group" : "Groupe",
      "Last8" : "Quart de finale",
      "Last16" : "Huitième de finale",
      "nav_groups" : "Groupes",
      "nopronos" : "Il n'y a aucun pronostic en cours pour ce groupe",
      "official_website" : "http://fr.uefa.com/uefaeuro/index.html",
      "playoff" : "Phase finale", 
      "prono" : "Pronostics",
      "Semi" : "Demi-finales",
      "ThirdPlace" : "Petite Finale",
      "title" : "EURO 2016 - France",
      
		  /* Groups */
      "groups" : [{
        "id" : "A",
        "idTeams" : ["95","22","160","78"]
      },{
        "id" : "B",
        "idTeams" : ["28","137","161","163"]
      },{
        "id" : "C",
        "idTeams" : ["23","157","158","100"]
      },{
        "id" : "D",
        "idTeams" : ["114","154","30","162"]
      },{
        "id" : "E",
        "idTeams" : ["135","25","159","26"]
      },{
        "id" : "F",
        "idTeams" : ["96","155","156","101"]
      }],
      
      /* Alert Success */
      "AddProno" : "Votre pronostic a été enregistré",
      "updateProno" : "Votre pronostic a été mis à jour"
		}
	}
}); 