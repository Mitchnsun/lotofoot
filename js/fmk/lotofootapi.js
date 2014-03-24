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
	}

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
		/* Pronos */
		getNewPronos : function(params, success, error) {
			return performWS('GET', urls.URL_GET_NEW_PRONOS, params, success, error);
		},
		addProno : function(params, success, error) {
			return performWS('POST', urls.URL_ADD_PRONO, params, success, error);
		},
		createGames : function(params, success, error) {
			return performWS('POST', urls.URL_CREATE_GAMES, params, success, error);
		},
		getPronos : function(params, success, error) {
			return performWS('GET', urls.URL_GET_PRONOS, params, success, error);
		},
		/* Common */
		getTeams : function(params, success, error) {
			return performWS('GET', urls.URL_GET_TEAMS, params, success, error);
		}
	};
});
