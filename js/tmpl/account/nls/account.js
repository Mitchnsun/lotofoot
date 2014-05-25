define({
	/* Please sort alphabetically */
	"root" : {
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
		  + "Le Lotofoot vous souhaite d'gréables pronostics!",
		/* Alert Warning */
		"EmptyLogIn" : "L'email et le mot de passe ne peuvent être vides, veuillez les compléter.",
		"IncorrectLogin" : "Vos identifiants sont incorrects, veuillez les corriger.",
		"NoSessionFound" : "Aucune session n'a été trouvée, veuillez vous connecter.",
		"WebStorageLogin" : "Votre navigateur est obsolète et ne supporte par certaines fontionnalités. "
			+ "Votre expérience utilisateur risque d'être altérée.<br/>"
			+ "Vous pouvez tout de même vous inscrire. "
			+ "Pour une meilleure expérience, mettez à jour votre navigateur."
	}
});
