define([], function() {
    return {
        create : function() {
            return _.extend({}, Backbone.Events);
        }
    };
});
/*
 * How to use it after it was passed to the view
 * this.eventBus.trigger('url:change',{url:'#'+url});
 */
