// Filename: main.js

// Require.js allows us to configure shortcut alias
require.config({
    paths : {
        'jquery' : '../libs/jquery', /* v1.9.1 */
        'underscore' : '../libs/underscore', /* v1.4.4 */
        'backbone' : '../libs/backbone', /* v1.0.0 */
        'bootstrap' : '../libs/bootstrap.min', /* v2.3.1 */
        'text' : '../libs/text',
        'dust' : '../libs/dust-full', /* v1.2.3 */
        'templateengine' : 'fmk/templateengine'
    },
    shim : {
        'jquery' : {
            exports : '$'
        },
        'underscore' : {
            exports : '_'
        },
        'backbone' : {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps : ['underscore', 'jquery'],
            //Once loaded, use thes global 'Backbone' as the
            //module value.
            exports : 'Backbone'
        },
        'dust' : {
            exports : 'dust'
        }
    }

});
require(['app'], // Load our app module and pass it to our definition function
function(App) {
    // The "app" dependency is passed in as "App"
    App.initialize();
});
