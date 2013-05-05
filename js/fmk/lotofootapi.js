define(['jquery'], function($) {

    // Application context (root)
    var urls = "";

    // Callback methods to catch errors
    var errorCallbacks = {};

    /*
    * Endpoint location
    */
    // ex var URL = "../server/file.php"
    var URL_TEST = "server/test.php";

    /*
     * Create the full url
     */
    function getUrl(apiUrl) {
        return urls + apiUrl;
    }

    function performGet(endpoint, data, success, error) {
        var url = getUrl(endpoint);
        return $.ajax({
            url : url,
            type : 'GET',
            data : data,
            success : function(data) {
                if (success) {
                    try{
                        var jsondata = $.parseJSON(data);
                        success(jsondata);
                    }catch(err){
                        error({status : 422, errorCode : 'JSON', error : err, data : data});
                    }
                }
            },
            error : errorHandler(error)
        });
    }

    function performPost(endpoint, data, success, error) {
        var url = getUrl(endpoint);
        return $.ajax({
            url : url,
            type : 'POST',
            data : data,
            success : function(data) {
                if (success) {
                    try{
                        var jsondata = $.parseJSON(data);
                        success(jsondata);
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
       test : function(data, success, error){
           return performGet(URL_TEST, data, success, error);
       }
    };
});
