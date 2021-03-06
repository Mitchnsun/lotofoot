define(['jquery', 'fmk/urls'], function($, urls) {

	// Callback methods to catch errors
	var errorCallbacks = {};

	/* Common ajax functions */
	function performWS(type, endpoint, data, success, error) {
		return $.ajax({
			url : endpoint,
			type : type,
			data : data,
			success : function(data) {
				if (success) {
					var jsondata;
					try {// Parse JSON
						jsondata = $.parseJSON(data);
					} catch(err) {
						jsondata = {
							status : 422,
							errorCode : 'JSON',
							error : err,
							data : data
						};
					}

					if (jsondata.status == 200) {
						success(jsondata);
					} else {
						error(jsondata);
					}
				}
			},
			error : errorHandler(error)
		});
	};
	
	/* For external api where the data is already a json */
	function externWS(type, endpoint, data, success, error) {
		return $.ajax({
			url : endpoint,
			type : type,
			data : data,
			contentType: "application/json",
      dataType: "json",
			success : function(data){success(data);},
			error : errorHandler(error)
		});
	};

	/*
	 * Handler based on the http status or 'fallback' key if nothing is registered for the status
	 */
	function errorHandler(error) {
		return function(xhr, ajaxOptions, thrownError) {
			statusCallback = errorCallbacks[xhr.status];
			fallbackCallback = errorCallbacks.fallback;

			if (statusCallback) {
				statusCallback(xhr, ajaxOptions, thrownError);
			} else {
				if (error) {
					error(xhr, ajaxOptions, thrownError);
				} else if (fallbackCallback) {
					fallbackCallback(xhr, ajaxOptions, thrownError);
				}
			}
		};
	}

	// Exported publics
	/* web service call */
	return {
		/* Authentication */
		login : function(params, success, error) {
			return performWS('POST', urls.URL_LOGIN, params, success, error);
		},
		checkSession : function(params, success, error) {
			return performWS('POST', urls.URL_CHECK_SESSION, params, success, error);
		},
		/* Account */
		newAccount : function(params, success, error) {
			return performWS('POST', urls.URL_NEW_ACCOUNT, params, success, error);
		},
		/* Pronos */
		getActivePronos : function(params, success, error) {
      return performWS('GET', urls.URL_GET_ACTIVE_PRONOS, params, success, error);
    },
		getNewPronos : function(params, success, error) {
			return performWS('GET', urls.URL_GET_NEW_PRONOS, params, success, error);
		},
		addProno : function(params, success, error) {
			return performWS('POST', urls.URL_ADD_PRONO, params, success, error);
		},
		betProno : function(params, success, error) {
      return performWS('POST', urls.URL_BET_PRONO, params, success, error);
    },
		createGames : function(params, success, error) {
			return performWS('POST', urls.URL_CREATE_GAMES, params, success, error);
		},
		getPronos : function(params, success, error) {
			return performWS('GET', urls.URL_GET_PRONOS, params, success, error);
		},
		getPreviousPronos : function(params, success, error) {
			return performWS('GET', urls.URL_GET_PREVIOUS_PRONOS, params, success, error);
		},
		updateProno : function(params, success, error){
			return performWS('POST', urls.URL_UPDATE_PRONO, params, success, error);
		},
		getPronosFromEvents : function(params, success, error){
		  return performWS('GET', urls.URL_GET_PRONOS_FROM_EVENTS, params, success, error);
		},
		betTop : function(params, success, error) {
		  return performWS('POST', urls.URL_BET_TOP, params, success, error);
		},
		getTopPronos : function(params, success, error) {
		  return performWS('GET', urls.URL_GET_TOP_PRONOS, params, success, error);
		},
		getActiveTops : function(params, success, error) {
			return performWS('GET', urls.URL_GET_ACTIVE_TOPS, params, success, error);
		},
		pronosValidation : function(params, success, error){
			return performWS('POST', urls.URL_PRONOS_VALIDATION, params, success, error);
		},
		pronosScores : function(params, success, error){
			return performWS('POST', urls.URL_PRONOS_SCORES, params, success, error);
		},
		/* Rankings */
		getRanking : function(params, success, error){
			return performWS('GET', urls.URL_GET_RANKING, params, success, error);
		},
		getRankingsList : function(params, success, error){
			return performWS('GET', urls.URL_GET_RANKINGS_LIST, params, success, error);
		},
		createRanking : function(params, success, error){
			return performWS('POST', urls.URL_CREATE_RANKING, params, success, error);
		},
		setRank : function(params, success, error){
			return performWS('POST', urls.URL_SET_RANK, params, success, error);
		},
		/* Common */
		getTeams : function(params, success, error) {
			return performWS('GET', urls.URL_GET_TEAMS, params, success, error);
		},
		/* External API */
		getCurrentGames : function(params, success, error){
			return externWS('GET', urls.API_WC14_CURRENT_GAMES, params, success, error);
		}
	};
});
