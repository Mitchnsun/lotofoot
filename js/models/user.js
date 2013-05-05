define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Model = Backbone.Model.extend({
        defaults : {
            userid : null,
            sessionid : null,
            email : null,
            firstname : null,
            lastname : null,
            right : null,
            isConnected : false,
            urlFrom : ""
        },
        /* Authentication */
       checkAuth : function(){
           return false;
       }
    });
    // Return the model for the module
    return Model;
}); 