define(['jquery'], function($) {

    // Application context (root)
    var urls = null;

    // Callback methods to catch errors
    var errorCallbacks = {};

    /*
    * Endpoint location
    */
    // ex var URL = "server/file.php"

    /*
     * Create the full url
     */
    function getUrl(apiUrl) {
        return urls + apiUrl;
    };

    function performGet(endpoint, success, error) {
        var url = getUrl(endpoint);
        return $.ajax({
            url : url,
            type : 'GET',
            dataType : 'json',
            success : function(data) {
                if (success) {
                    success(data);
                }
            },
            error : errorHandler(error)
        });
    };

    function performPost(endpoint, data, success, error) {
        var url = getUrl(endpoint);
        return $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            data : JSON.stringify(data),
            success : function(data) {
                if (success) {
                    success(data);
                }
            },
            error : errorHandler(error)
        });
    };

    /*
     * Handler based on the http status or 'fallback' key if nothing is registered for the status
     */
    function errorHandler(error) {
        return function(xhr, ajaxOptions, thrownError) {
            statusCallback = errorCallbacks[xhr.status];
            fallbackCallback = errorCallbacks['fallback'];

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
    };

    // Exported publics
    return {
        setUrls : function(context) {
            urls = context;
        },
        getUrls : function() {

        },
        /* web service call */
    };
});
