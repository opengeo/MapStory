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
            className: 'layer-element',
            template: _.template($('#layer-element').html()),
            events: {
                'click a': 'addToMap'
            },
            addToMap: function () {
                console.log('hello world');
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
                var ul = this.$el.find('ul#layers'),
                    queryParameters = {
                        btype: 'layer',
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
                            layer: layer
                        }).render();
                        ul.append(eln.$el);
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

        $('.container a').click(function () {
            var layerSearch = new LayerSearch({
                searchUrl: options.searchUrl
            }).render();
        });
    };

}(jQuery));


