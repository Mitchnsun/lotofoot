define([], function() {
	return {
		/* Front */
		ADMIN : {hash : "admin", path : 'admin/adminview'},
		CREATE_GAMES : {hash : "create-games", path : 'admin/creategamesview'},
		HOME : {hash : "home", path : 'homepage/homepageview'},
		LOGIN : {hash : "login", path : 'authentication/loginview'},
		NEW_ACCOUNT : {hash : "new-account", path : 'account/createview'},
		PROFILE : {hash : "profile", path : 'account/profileview'},
		PRONOS : {hash : "pronos", path : 'pronos/pronosview'},
		RANKING : {hash : "ranking", path : 'rankings/rankingview'},
		/*TOP_PRONOS : {hash : "top/pronos", path : 'pronos/topview'},*/
		EURO : {hash : "euro", path : 'events/euroview'},
    EURO_PLAYOFF : {hash : "euro/playoff", path : 'events/euroview'},
		WORLDCUP : {hash : "world-cup", path : 'events/worldcupview'},
		WORLDCUP_PLAYOFF : {hash : "world-cup/playoff", path : 'events/worldcupview'},
		ROOT : {hash : "", path : 'homepage/homepageview'},

		/* Server */
		/* Authentication */
		URL_LOGIN : "server/authentication/login.php",
		URL_CHECK_SESSION : "server/authentication/checkSession.php",
		/* Account */
		URL_NEW_ACCOUNT : "server/account/newaccount.php",
		/* Pronos */
		URL_GET_ACTIVE_PRONOS : "server/pronos/getActivePronos.php",
		URL_GET_NEW_PRONOS : "server/pronos/getNewPronos.php",
		URL_ADD_PRONO : "server/pronos/addProno.php",
		URL_BET_PRONO : "server/pronos/betProno.php",
		URL_CREATE_GAMES : "server/pronos/creategames.php",
		URL_GET_PRONOS : "server/pronos/getpronos.php",
		URL_GET_PREVIOUS_PRONOS : "server/pronos/getpreviouspronos.php",
		URL_UPDATE_PRONO : "server/pronos/updateprono.php",
		URL_GET_PRONOS_FROM_EVENTS : "server/events/getPronosFromEvents.php",
		URL_BET_TOP : "server/pronos/betTop.php",
		URL_GET_TOP_PRONOS : "server/pronos/getTopPronos.php",
		URL_GET_ACTIVE_TOPS : "server/pronos/getActiveTops.php",
		URL_PRONOS_VALIDATION : "server/pronos/pronosvalidation.php",
		URL_PRONOS_SCORES : "server/pronos/pronosscores.php",
		/* Rankings */
		URL_CREATE_RANKING : "server/ranking/createranking.php",
		URL_SET_RANK : "server/ranking/setrank.php",
		URL_GET_RANKING : "server/ranking/getranking.php",
		URL_GET_RANKINGS_LIST : "server/ranking/getrankingslist.php",
		/* Get Common datas */
		URL_GET_TEAMS : "server/common/v2/getTeams.php",

		/* External links */
		EXT_BLOG : '/lotofoot/blog',
		API_WC14_CURRENT_GAMES : 'http://worldcup.sfg.io/matches/current'
	};
});