/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global window, jQuery, _, Ext  */

(function ($) {
    'use strict';
    var LayerResult, LayerSearch, layerElementTemplate, widgetTemplate;


    layerElementTemplate = new Ext.Template(
        '<div class="ms-layer-title">',
        '<p>',
        '<a class="show-meta" href="#">{title}</a> by ',
        '<a href="<%= layer.owner_detail %>">{owner}</a> on ',
        '{last_modified}',
        '<a class="ms-add-to-map" href="#">Add to map</a>',
        '</p>',
        '</div>',
        '<div class="ms-layer-info">',
        '<img src="{thumb}">',
        '<p class="ms-layer-rating">{views} Views |',
        ' {rating} Rating</p>',
        '<div class="ms-layer-abstract">{abstract}</div>',
        '</div>'

    ).compile();

    // maybe this template should live in the html document
    widgetTemplate = new Ext.Template(
    '<div id="ms-header">',
      '<form>',
        '<fieldset>',
          '<button id="search" type="submit" class="btn">Search</button>',
          '<input id="query" type="text" class="search-query">',
          '<select id="sortBy">',
            '<option value="newest">Newest</option>',
            '<option value="oldest">Oldest</option>',
            '<option value="alphaaz">Alphabetical (A-Z)</option>',
            '<option value="alphaza">Alphabetical (Z-A)</option>',
            '<option value="popularity">Popularity</option>',
            '<option value="rel">Relevance</option>',
          '</select>',
        '</fieldset>',
        '<fieldset>',
          '<label>Limit layers current map area</label>',
          '<input id="bbox-limit" type="checkbox">',
          '<label>Show meta info expanded</label>',
          '<input id="show-meta-info" type="checkbox" checked>',
        '</fieldset>',
      '</form>',
    '</div>',
    '<div id="ms-search-layers">',
      '<ul>',
      '</ul>',
    '</div>',
    '<div id="ms-footer">',
      '<button id="done" class="btn">Done</button>',
    '</div>').compile();

    LayerResult = function (options) {
        this.$el = $('<li>');
        this.layer = options.layer;
        this.geoExplorer = options.geoExplorer;
        this.template = layerElementTemplate;
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

    LayerResult.prototype.toggleInfo = function (event) {
        this.$el.find('div.ms-layer-info').toggle();
    };

    LayerResult.prototype.render = function (showMeta) {

        this.$el.html(this.template.apply(this.layer));


        if (!showMeta) {
            this.$el.find('div.ms-layer-info').hide();
        }


        this.$el.find('.ms-layer-abstract').expander({
            slicePoint: 200
        });


        this.$el.find('a.ms-add-to-map').click(
            Ext.createDelegate(this.addToMap, this)
        );

        this.$el.find('.show-meta').click(
            Ext.createDelegate(this.toggleInfo, this)
        );

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

        $(window).resize(
            Ext.createDelegate(this.setLeft, this)
        );

        this.setLeft();
        this.template = widgetTemplate;

    };

    LayerSearch.prototype.setLeft = function () {
        var widgetWidth = 600;
        this.$el.css('left', $(window).width() / 2 - widgetWidth / 2);
    };

    LayerSearch.prototype.renderLayer = function (layer, showMeta) {
        var element = new LayerResult({
                layer: layer,
                geoExplorer: this.geoExplorer
            }).render(showMeta);

        this.$layerList.append(element.$el);
    };

    LayerSearch.prototype.doSearch = function () {
        var self = this,
            showMeta = this.$el.find('#show-meta-info:checkbox').is(':checked'),
            queryParameters = {
                // hard code the type as it does not sense to add a
                // map to another map
                bytype: 'layer',
                limit: 50,
                sort: this.$el.find('#sortBy').val()
            },
            q  = this.$el.find('#query').val();

        if (q !== '') {
            queryParameters.q = q;
        }

        this.$layerList.empty();

        $.ajax({
            url: this.searchUrl,
            data: queryParameters
        }).done(function (data) {
            $.each(data.rows, function (idx, layer) {
                self.renderLayer(layer, showMeta);
            });
        });

    };
    LayerSearch.prototype.render = function () {
        var doSearch = Ext.createDelegate(this.doSearch, this);

        this.$el.append(this.template.apply());
        this.$layerList = this.$el.find('#ms-search-layers ul');

        // populate the widget when its rendered
        this.doSearch();

        // after the elements are added to the dom element attach the
        // events

        this.$el.find('#done').click(
            Ext.createDelegate(function () {
                this.$el.remove();
            }, this)
        );

        this.$el.find('#search').click(doSearch);
        this.$el.find('#query').blur(doSearch);
        this.$el.find('#sortBy').change(doSearch);
        this.$el.find('#bbox-limit').change(doSearch);
        this.$el.find('#show-meta-info').change(doSearch);

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
