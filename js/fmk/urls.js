define([], function() {
    return {
    		/* Front */
    		CREATE_GAMES : "create-games",
        HOME : "",
        LOGIN : "login",
        PRONOS : "pronos",
        RANKING : "ranking",
        
        
        /* Server */
       	/* Authentication */
				URL_LOGIN : "server/authentication/login.php",
				URL_CHECK_SESSION : "server/authentication/checkSession.php",
				
				/* Pronos */
				URL_GET_NEW_PRONOS : "server/pronos/getNewPronos.php",
				URL_ADD_PRONO : "server/pronos/addProno.php",
				URL_CREATE_GAMES : "server/pronos/creategames.php",
				URL_GET_PRONOS : "server/pronos/getpronos.php",
				
				/* Rankings */
				URL_GET_RANKING : "server/ranking/getranking.php",
				/* Get Common datas */
				URL_GET_TEAMS : "server/common/getTeams.php",
				
				/* External links */
				EXT_BLOG : '/lotofoot/blog'
    };
});
