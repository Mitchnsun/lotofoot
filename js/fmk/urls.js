define([], function() {
    return {
    		/* Front */
        HOME : "",
        LOGIN : "login",
        PRONOS : "pronos",
        CREATE_GAMES : "create-games",
        
        /* Server */
       	/* Authentication */
				URL_LOGIN : "server/authentication/login.php",
				URL_CHECK_SESSION : "server/authentication/checkSession.php",
				
				/* Pronos */
				URL_GET_NEW_PRONOS : "server/pronos/getNewPronos.php",
				URL_ADD_PRONO : "server/pronos/addProno.php",
				URL_CREATE_GAMES : "server/pronos/creategames.php",
				URL_GET_PRONOS : "server/pronos/getpronos.php",
				
				/* Get Common datas */
				URL_GET_TEAMS : "server/common/getTeams.php",
				
				/* External links */
				EXT_BLOG : '/lotofoot/blog'
    };
});
