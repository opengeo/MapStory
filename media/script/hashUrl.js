/*global $, window, app, Ext */
(function (window, Ext) {
    'use strict';
    var doHashUrl, setMaxSize;

    setMaxSize = function (app) {
        // calculate the height of the header in order to exclude that value
        // from the fullscreen size
        var headerHeight = Ext.get('header').getHeight() +
            Ext.get('top-crossbar').getHeight() +
            Ext.get('crossbar').getHeight(),

            main = Ext.get('main'),
            newWidth = window.innerWidth + 1, // why the +1 ?
            newHeight = window.innerHeight = headerHeight + 2; // why ?

        app.portal.setSize(newWidth, newHeight);
        app.portal.el.alignTo(main, 'tl-tl', [0, 0]);
    };

    doHashUrl = function (app) {

        var location = window.location,
            hash     = location.hash;

        // make sure we have a hash URL
        if (hash) {
            if (hash === '#full') {
                // set the window to fullscreen
                setMaxSize(app);
            }
        }
    };

    // export the function to the global scope
    window.doHashUrl = doHashUrl;



}(window, Ext));
