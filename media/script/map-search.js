/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global window, jQuery, _, Ext  */

(function ($) {
    'use strict';
    var LayerResult, LayerSearch;

    LayerResult = function (options) {
        this.$el = $('<li>');
        this.layer = options.layer;
        this.geoExplorer = options.geoExplorer;
        this.template = _.template($('#layer-element').html());
    };

    LayerResult.prototype.checkLayerSource = function (callback) {
        var ge = this.geoExplorer,
            layer = this.layer,
            sourceId = 'geonode:' + layer.title + '-search',
                    // get the layer source from Geo explorer
            source = ge.layerSources[sourceId];

        if (!source) {
            source = ge.addLayerSource({
                id: sourceId,
                config: {
                    isLazy: function () { return false; },
                    ptype: 'gxp_wmscsource',
                    hidden: true,
                    restUrl: "/gs/rest", // TODO hard coded
                    version: "1.1.1",
                    url: layer.owsUrl
                }
            });
            source.on({
                ready: function () {
                    callback(source);
                }
            });
        } else {
            callback(source);
        }

    };

    LayerResult.prototype.addToMap = function () {

        var ge = this.geoExplorer,
            layerStore = ge.mapPanel.layers,
            layer = this.layer;

        this.checkLayerSource(function (source) {
            var record = source.createLayerRecord({
                name: layer.title,
                source: source.id
            });
            layerStore.add([record]);

        });
    };

    LayerResult.prototype.render = function () {
        this.$el.html(this.template({
            layer: this.layer
        }));
        this.$el.find('a').click(_.bind(this.addToMap, this));
        return this;
    };

    // main view object controls rendering widget template and
    // controls the events that are attached to this widget
    LayerSearch = function (options) {
        this.searchUrl = options.searchUrl;
        this.geoExplorer = options.geoExplorer;

        this.$el = $('<div/>', {
            id: 'ms-search-widget'
        });

        this.$el.css('left', $(window).width() / 2 - 300);

        this.template = _.template($('#add-layer-template').html());

    };
    LayerSearch.prototype.doSearch = function () {
        var ul = this.$el.find('div#ms-search-layers ul'),
            self = this,
            queryParameters = {
                bytype: 'layer',
                limit: 50,
                sort: this.$el.find('#sortBy').val()
            },
            q  = this.$el.find('#query').val();

        if (q !== '') {
            queryParameters.q = q;
        }

        ul.empty();

        $.ajax({
            url: this.searchUrl,
            data: queryParameters
        }).done(function (data) {
            _.each(data.rows, function (layer) {
                var eln = new LayerResult({
                    layer: layer,
                    geoExplorer: self.geoExplorer
                }).render();
                eln.$el.hide();
                ul.append(eln.$el);
                eln.$el.fadeIn(1000);
            });
        });

    };
    LayerSearch.prototype.render = function () {
        var doSearch = _.bind(this.doSearch, this);

        this.$el.append(this.template());

        // populate the widget when its rendered
        this.doSearch();

        // after the elements are added to the dom element attach the
        // events

        this.$el.find('#done').click(_.bind(function () {
            this.$el.remove();
        }, this));

        this.$el.find('#search').click(doSearch);
        this.$el.find('#query').blur(doSearch);
        this.$el.find('#sortBy').change(doSearch);
        this.$el.find('#bbox-limit').change(doSearch);

        $('body').append(this.$el);
        return this;
    };

    window.LayerSearch = LayerSearch;

    window.main = function (options) {

        $('#add-layers').click(function () {
            var layerSearch = new LayerSearch({
                searchUrl: options.searchUrl,
                geoExplorer: options.geoExplorer
            }).render();
        });
    };

}(jQuery));
