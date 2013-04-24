/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global window, jQuery, _, Backbone  */

(function ($) {
    'use strict';
    var sortOptions = [
        {
            title: 'Newest',
            value: 'newest'
        },
        {
            title: 'Oldest',
            value: 'oldest'
        },
        {
            title: 'Alphabetical (A - Z)',
            value: 'alphaaz'
        },
        {
            title: 'Alphabetical (Z - A)',
            value: 'alphaza'
        },
        {
            title: 'Popularity',
            value: 'popularity'
        },
        {
            title: 'Relevance',
            value: 'rel'
        }
    ],
        LayerElement = Backbone.View.extend({
            tagName: 'li',
            template: _.template($('#layer-element').html()),
            events: {
                'click a': 'addToMap'
            },

            checkLayerSource: function () {
                var ge = this.options.geoExplorer,
                    layer = this.options.layer,
                    sourceId = 'geonode:' + layer.title + '-search',
                    // get the layer source from Geo explorer
                    source = ge.layerSources[sourceId];

                if (!source) {
                    source = ge.addLayerSource({
                        id: sourceId,
                        config: {
                            isLazy: function () { return false ;},
                            ptype: 'gxp_wmscsource',
                            hidden: true,
                            restUrl: "/gs/rest", // TODO hard coded
                            version: "1.1.1",
                            url: layer.owsUrl
                        }
                    });
                }

                source.store.load();
                return source;

            },
            addToMap: function () {
                var source = this.checkLayerSource(),
                    ge = this.options.geoExplorer,
                    layerStore = ge.mapPanel.layers,
                    layer = this.options.layer,
                    record;

                source.on({
                    ready: function () {
                        record = source.createLayerRecord({
                            name: layer.title,
                            source: source.id
                        });
                        layerStore.add([record]);

                    }
                });


            },
            render: function () {
                this.$el.html(this.template({
                    layer: this.options.layer
                }));
                return this;
            }
        }),
        LayerSearch = Backbone.View.extend({
            tagName: 'div',
            className: 'modal',
            template: _.template($('#add-layer-template').html()),
            events: {
                'click #done': 'remove',
                'click #search': 'doSearch',
                'blur #query': 'doSearch',
                'change #sortBy': 'doSearch'
            },

            doSearch: function () {
                var ul = this.$el.find('ul#ms-search-layers'),
                    self = this,
                    queryParameters = {
                        btype: 'layer',
                        limit: 50,
                        sort: this.$el.find('#sortBy').val()
                    },
                    q  = this.$el.find('#query').val();

                if (q !== '') {
                    queryParameters.q = q;
                }

                ul.empty();

                $.ajax({
                    url: this.options.searchUrl,
                    data: queryParameters
                }).done(function (data) {
                    _.each(data.rows, function (layer) {
                        var eln = new LayerElement({
                            layer: layer,
                            geoExplorer: self.options.geoExplorer
                        }).render();
                        eln.$el.hide();
                        ul.append(eln.$el);
                        eln.$el.fadeIn(1000);
                    });
                });
            },

            render: function () {
                this.$el.append(this.template({
                    sortOptions: sortOptions
                }));
                $('body').append(this.$el);
                this.doSearch();
                return this;
            }
        });

    window.main = function (options) {

        $('#add-layers').click(function () {
            var layerSearch = new LayerSearch({
                searchUrl: options.searchUrl,
                geoExplorer: options.geoExplorer
            }).render();
        });
    };

}(jQuery));
