define([], function() {
    return {
        create : function() {
            return _.extend({}, Backbone.Events)
        }
    }
})
