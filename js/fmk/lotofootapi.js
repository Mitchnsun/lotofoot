define(['jquery'], function($) {
	
    // Callback methods to catch errors
    var errorCallbacks = {};

    /*
    * Endpoint location
    */
    // ex var URL = "../server/file.php"
    var URL_LOGIN = "server/authentication/login.php";
    var URL_CHECK_SESSION = "server/authentication/checkSession.php";

    function performGet(endpoint, data, success, error) {
        return $.ajax({
            url : endpoint,
            type : 'GET',
            data : data,
            success : function(data) {
                if (success) {
                    try{
                        var jsondata = $.parseJSON(data);
                        if(jsondata.status == 200){
                        	success(jsondata);	
                        }else{
                        	error(jsondata);
                        }
                    }catch(err){
                        error({status : 422, errorCode : 'JSON', error : err, data : data});
                    }
                }
            },
            error : errorHandler(error)
        });
    }

    function performPost(endpoint, data, success, error) {
        return $.ajax({
            url : endpoint,
            type : 'POST',
            data : data,
            success : function(data) {
                if (success) {
                    try{
                        var jsondata = $.parseJSON(data);
                        if(jsondata.status == 200){
                        	success(jsondata);	
                        }else{
                        	error(jsondata);
                        }
                    }catch(err){
                        error({status : 422, errorCode : 'JSON', error : err, data : data});
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
    return {
        /* web service call */
       login : function(params, success, error){
       		return performPost(URL_LOGIN, params, success, error);
       },
       checkSession : function(params, success, error){
       		return performPost(URL_CHECK_SESSION, params, success, error);
       }
    };
});
