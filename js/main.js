// Filename: main.js

// Require.js allows us to configure shortcut alias
require.config({
    paths : {
        'jquery' : '../libs/jquery', /* v1.9.1 */
        'jqueryUI' : '../libs/jquery-ui.min', /* v1.10.3 */
        'underscore' : '../libs/underscore', /* v1.4.4 */
        'backbone' : '../libs/backbone', /* v1.1.2 */
        'bootstrap' : '../libs/bootstrap.min', /* v2.3.1 */
        'text' : '../libs/text',
        'i18n' : '../libs/i18n',
        'dust' : '../libs/dust-full' /* v1.2.3 */
    },
    shim : {
        'jquery' : {
            exports : '$'
        },
        'jqueryUI' : {
            deps : ['jquery']
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
