define([], function() {
	return {
		/* Front */
		CREATE_GAMES : "create-games",
		HOME : "home",
		LOGIN : "login",
		NEW_ACCOUNT : "new-account",
		PRONOS : "pronos",
		RANKING : "ranking",
		ROOT : "",
		TOP_PRONOS : "top/pronos",
		WORLDCUP : "world-cup",

		/* Server */
		/* Authentication */
		URL_LOGIN : "server/authentication/login.php",
		URL_CHECK_SESSION : "server/authentication/checkSession.php",
		/* Account */
		URL_NEW_ACCOUNT : "server/account/newaccount.php",
		/* Pronos */
		URL_GET_NEW_PRONOS : "server/pronos/getNewPronos.php",
		URL_ADD_PRONO : "server/pronos/addProno.php",
		URL_CREATE_GAMES : "server/pronos/creategames.php",
		URL_GET_PRONOS : "server/pronos/getpronos.php",
		URL_GET_PREVIOUS_PRONOS : "server/pronos/getpreviouspronos.php",
		URL_UPDATE_PRONO : "server/pronos/updateprono.php",
		URL_GET_PRONOS_FROM_EVENTS : "server/events/getPronosFromEvents.php",
		URL_BET_TOP : "server/pronos/betTop.php",
		URL_GET_TOP_PRONOS : "server/pronos/getTopPronos.php",
		/* Rankings */
		URL_GET_RANKING : "server/ranking/getranking.php",
		/* Get Common datas */
		URL_GET_TEAMS : "server/common/getTeams.php",

		/* External links */
		EXT_BLOG : '/lotofoot/blog',
		API_WC14_CURRENT_GAMES : 'http://worldcup.sfg.io/matches/current'
	};
});