/*global $, window, app, Ext */
(function (window, Ext) {
    'use strict';
    var doHashUrl, setMaxSize, setOriginalSize, setButtonState;

    setButtonState = function (button) {

    };

// in the playback tool bar we store the original size as a property
// on the portal
    setOriginalSize = function (app) {
        if (typeof app.originalSize === 'undefined') {
            app.portal.originalSize = app.portal.getSize();
        }
        return app;
    };

    setMaxSize = function (app) {
// calculate the height of the header in order to exclude that value
// from the fullscreen size

        var headerHeight =
            Ext.get('header').getHeight() +
            Ext.get('top-crossbar').getHeight() +
            Ext.get('crossbar').getHeight(),

            main = Ext.get('main'),
            newWidth = window.innerWidth + 1, // why the +1 ?
            newHeight = window.innerHeight - headerHeight + 2; // why ?


        setOriginalSize(app);

        app.portal.setSize(newWidth, newHeight);
        app.portal.el.alignTo(main, 'tl-tl', [-8, 0]);
        Ext.getBody().setStyle({overflow: 'hidden'});
        window.scrollTo(0, 0);
// TODO at this point we need to switch the state of the button and
// maybe set the originalSize property of the app.portal object
    };

    doHashUrl = function (app) {

        var parseUrl = function () {
            var location = window.location,
                hash     = location.hash;

            if (hash === '#full') {
                setMaxSize(app);
            } else {
                //setOriginalSize(app);
            }
        };

// wait until the portal has everything it needs to run
        app.on('portalready', function () {
            parseUrl();
        });

// this event needs to be attached to the window when the map
// is in full screen mode

        Ext.EventManager.onWindowResize(function () {
            parseUrl();
        });

// make sure we have the onhashchange event
        if (typeof window.onhashchange !== 'undefined') {
            window.onhashchange = function (event) {
                parseUrl();
            };

        }

    };


// export the function to the global scope
    window.doHashUrl = doHashUrl;



}(window, Ext));
