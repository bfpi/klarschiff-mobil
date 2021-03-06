/* vim: set ts=4 sw=4: */
/**
 * KsMobil.MapController
 * Map view controller.
 *
 * @author Christian Wygoda <christian.wygoda@wheregroup.com>
 * @author Niels Bennke <bennke@bfpi.de>
 *
 */
KsMobil.MapController = M.Controller.extend({
    view: null,
    map: null,
    toolbar: null,
    baselayers: null,
    rules: null,
    styles: null,
    controls: null,
    position: null,
    positionPoint: null,

    clusterStrategy: new OpenLayers.Strategy.Cluster({
        distance: 60,
        threshold: 2,
        deactivate: function() {
            var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
            if (deactivated) {
                var features = [];
                var clusters = this.layer.features;
                for (var i=0; i<clusters.length; i++) {
                    var cluster = clusters[i];
                    if (cluster.cluster) {
                        for (var j=0; j<cluster.cluster.length; j++) {
                            features.push(cluster.cluster[j]);
                        }
                    }
                    else {
                        features.push(cluster);
                    }
                }
                this.layer.removeAllFeatures();
                this.layer.events.un( { "beforefeaturesadded" : this.cacheFeatures, "moveend" : this.cluster, scope : this } );
                this.layer.addFeatures(features);
            }
            return deactivated;
        },
        activate: function() {
            var activated = OpenLayers.Strategy.prototype.activate.call(this);
            if (activated) {
                var features = [];
                var clusters = this.layer.features;
                for (var i=0; i<clusters.length; i++) {
                    var cluster = clusters[i];
                    if (cluster.cluster) {
                        for (var j=0; j<cluster.cluster.length; j++) {
                            features.push(cluster.cluster[j]);
                        }
                    }
                    else {
                        features.push(cluster);
                    }
                }
                this.layer.removeAllFeatures();
                this.layer.events.on( { "beforefeaturesadded" : this.cacheFeatures, "moveend" : this.cluster, scope : this});
                this.layer.addFeatures(features);
            }
            return activated;
        }
    }),

    /**
     * Constructor. Builds Openlayers Map.
     * Layers, styles, controls are hardwired in here.
     */
    init: function(isFirstTime) {
        var self = this;

        if (isFirstTime) {
            // define transformation rule for PROJ4JS
            Proj4js.defs["EPSG:25833"] = "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs";
            this.view = M.ViewManager.getView('mapPage', 'map');
            this.toolbar = M.ViewManager.getView('mapPage', 'toolbar');
            $('#' + this.toolbar.id).bind('touchmove', function() {
                return false;
            });

            $("#plus").tap(function() {
                KsMobil.MapController.zoomIn();
            });
            $("#minus").tap(function() {
                KsMobil.MapController.zoomOut();
            });

            this.rules = {
                standard: new OpenLayers.Rule({
                    elseFilter: true,
                    symbolizer: {}
                }),
                cluster: new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.GREATER_THAN,
                        property: "count",
                        value: 1
                    }),
                    symbolizer: {
                        externalGraphic: KsMobil.URLS.icons + '/generalisiert.png',
                        graphicWidth: 44,
                        graphicHeight: 44,
                        graphicXOffset: -22,
                        graphicYOffset: -22,
                        label: "${count}",
                        fontFamily: "Verdana, 'Droid Sans', sans-serif",
                        fontSize: "20px",
                        fontWeight: "bold",
                        labelAlign: "cm",
                        cursor: "pointer"
                    }
                })
            };

            this.styles = {
                meldungen: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        graphicWidth: 36,
                        graphicHeight: 43,
                        graphicXOffset: -4,
                        graphicYOffset: -41,
                        externalGraphic: KsMobil.URLS.icons + '/${vorgangstyp}_${status}.png',
                        cursor: "pointer"
                    }, {
                        rules: [this.rules.cluster, this.rules.standard]
                    }),
                    "select": new OpenLayers.Style({
                        graphicWidth: 56,
                        graphicHeight: 64,
                        graphicXOffset: -14,
                        graphicYOffset: -51,
                        externalGraphic: KsMobil.URLS.icons + '/${vorgangstyp}_${status}_s.png',
                        cursor: "pointer"
                    }, {
                        rules: [this.rules.cluster, this.rules.standard]
                    }),
                    "temporary": new OpenLayers.Style({
                        graphicWidth: 56,
                        graphicHeight: 64,
                        graphicXOffset: -14,
                        graphicYOffset: -51,
                        externalGraphic: KsMobil.URLS.icons + '/${vorgangstyp}_${status}_s.png',
                        cursor: "pointer"
                    })
                })
            };

            this.layers = {
                trackMe: new OpenLayers.Layer.Vector('trackMe'),
                meldungen: new OpenLayers.Layer.Vector('Meldungen', {
                    protocol: new OpenLayers.Protocol.WFS({
                        url: KsMobil.URLS.meldungWFS,
                        version: '1.1.0',
                        featureType: KsMobil.WFSOptions.meldungWFSFeatureType,
                        featureNS: KsMobil.URLS.meldungWFSFeatureNS,
                        srsName: 'EPSG:25833'
                    }),
                    strategies: [
                        new OpenLayers.Strategy.BBOX(),
                        KsMobil.MapController.clusterStrategy
                    ],
                    styleMap: this.styles.meldungen
                }),
                poi: new OpenLayers.Layer.WMS('Klarschiff-POI', 'http://geo.sv.rostock.de/geodienste/klarschiff-poi/wms', {
                        layers: 'hro.klarschiff-poi.abfallbehaelter,hro.klarschiff-poi.ampeln,hro.klarschiff-poi.beleuchtung,hro.klarschiff-poi.brunnen,hro.klarschiff-poi.denkmale,hro.klarschiff-poi.hundetoiletten,hro.klarschiff-poi.recyclingcontainer,hro.klarschiff-poi.sitzgelegenheiten,hro.klarschiff-poi.sperrmuelltermine',
                        format: 'image/png',
                        transparent: true,
                    },
                    {
                        transitionEffect: 'resize',
                        displayInLayerSwitcher: false,
                        isBaseLayer: false,
                        minScale: 1100,
                        singleTile: true
                    }
                ),
                stadtplan: new OpenLayers.Layer.WMTS({
                    name: 'Stadtplan',
                    url: 'http://www.orka-mv.de/geodienste/orkamv/wmts/orkamv/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
                    layer: 'orkamv',
                    matrixSet: 'epsg_25833',
                    format: 'png',
                    style: 'default',
                    requestEncoding: 'REST',
                    serverResolutions: [4891.96981025128,3459.1450261886484,2445.9849051256397,1729.5725130942737,1222.9924525628198,864.7862565471368,611.4962262814098,432.3931282735683,305.7481131407049,216.19656413678416,152.8740565703524,108.09828206839207,76.43702828517618,54.049141034196026,38.21851414258809,27.024570517098006,19.109257071294042,13.512285258549001,9.55462853564702,6.7561426292745,4.77731426782351,3.3780713146372494,2.3886571339117544,1.6890356573186245,1.1943285669558772,0.8445178286593122,0.5971642834779384,0.422258914329656,0.29858214173896913,0.21112945716482798,0.14929107086948457,0.10556472858241398,0.07464553543474227,0.05278236429120697,0.03732276771737113]
                }),
                luftbild: new OpenLayers.Layer.WMTS({
                    name: 'Luftbild',
                    url: 'http://geo.sv.rostock.de/geodienste/luftbild_mv-40/wmts/hro.luftbild_mv-40.luftbild_mv-40/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
                    layer: 'hro.luftbild_mv-40.luftbild_mv-40',
                    matrixSet: 'epsg_25833',
                    format: 'png',
                    style: 'default',
                    requestEncoding: 'REST',
                    serverResolutions: [4891.96981025128,3459.1450261886484,2445.9849051256397,1729.5725130942737,1222.9924525628198,864.7862565471368,611.4962262814098,432.3931282735683,305.7481131407049,216.19656413678416,152.8740565703524,108.09828206839207,76.43702828517618,54.049141034196026,38.21851414258809,27.024570517098006,19.109257071294042,13.512285258549001,9.55462853564702,6.7561426292745,4.77731426782351,3.3780713146372494,2.3886571339117544,1.6890356573186245,1.1943285669558772,0.8445178286593122,0.5971642834779384,0.422258914329656,0.29858214173896913,0.21112945716482798,0.14929107086948457,0.10556472858241398,0.07464553543474227,0.05278236429120697,0.03732276771737113]
                })
            };

            this.layers.stadtplan.attribution = 'Kartenbild © Hansestadt Rostock (<a href="http://creativecommons.org/licenses/by/3.0/deed.de" target="_blank" style="color:#006CB7;text-decoration:none;">CC BY 3.0</a>)<br/>Kartendaten © <a href="http://www.openstreetmap.org/" target="_blank" style="color:#006CB7;text-decoration:none;">OpenStreetMap</a> (<a href="http://opendatacommons.org/licenses/odbl/" target="_blank" style="color:#006CB7;text-decoration:none;">ODbL</a>) und <a href="https://geo.sv.rostock.de/uvgb.html" target="_blank" style="color:#006CB7;text-decoration:none;">uVGB-MV</a>';
            this.layers.luftbild.attribution = '© GeoBasis-DE/M-V';

            this.controls = {
                locate: new OpenLayers.Control.Geolocate({
                    id: 'locate-control',
                    bind: false,
                    watch: true,
                    geolocationOptions: {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 7000
                    }
                }),
                touch: new OpenLayers.Control.TouchNavigation({
                    dragPanOptions: {
                        interval: 100,
                        enableKinetic: true
                    }
                }),
                select: new OpenLayers.Control.SelectFeature(this.layers.meldungen, {
                    autoActivate: true,
                    onSelect: function(feature) {
                        var e = $.Event('select');
                        e.feature = feature;
                        $('#' + self.view.id).trigger(e);
                    }
                }),
                scaleLine: new OpenLayers.Control.ScaleLine(),
                attribution: new OpenLayers.Control.Attribution()
            };

            this.map = this.view.initMap({
                projection: new OpenLayers.Projection('EPSG:25833'),
                resolutions: [27.024570517098006,19.109257071294042,13.512285258549001,9.55462853564702,6.7561426292745,4.77731426782351,3.3780713146372494,2.3886571339117544,1.6890356573186245,1.1943285669558772,0.8445178286593122,0.5971642834779384,0.422258914329656,0.29858214173896913,0.21112945716482798,0.14929107086948457],
                units: 'm',
                maxExtent: new OpenLayers.Bounds(-464849.38, 5057815.86858, 787494.891424, 6310160.14),
                restrictedExtent: new OpenLayers.Bounds(302094.673, 5991073.68, 325566.696, 6016342.598)
            },
            this.layers,
            {
                styles: this.styles,
                rules: this.rules
            },
            this.controls
            );

            var next = this.view.nextBaselayer();
        }

        this.fitMap();

        if (isFirstTime) {
            // set initial center (with movement for small devices)
            this.map.setCenter(this._getMapCenter());
        }

        this.controls.locate.events.on({
            "locationupdated": $.proxy(this.geolocate, this),
            "locationfailed": $.proxy(this.geolocateMiss, this),
            "locationuncapable": $.proxy(this.geolocateMiss, this)
        });
        this.controls.locate.activate();
    },

    geolocateMiss: function(event) {
        if (event.error.code != 3) {
            // stop continous positioning unless timeout error
            event.object.deactivate();
        }
    },

    /**
     * Initial and continous positioning with marker and accuracy circle.
     */
    geolocate: function(event) {
        this.positionPoint = event.point;
        var newPosition = event.position;
        var firstRun;
        if (this.position == undefined) {
            this.position = newPosition;
            firstRun = true;
        }
        this.layers.trackMe.removeAllFeatures();
        this.layers.trackMe.addFeatures(this._getPositionFeatureArr(this.positionPoint, newPosition.coords.accuracy));
        if (firstRun) {
            var p = new OpenLayers.LonLat(this.positionPoint.x, this.positionPoint.y);
            if (this.map.restrictedExtent.containsLonLat(p)) {
                this.map.setCenter(p, this._getZoomLevel(newPosition.coords.accuracy));
            }
            else {
                this.map.zoomToMaxExtent();
                this.map.setCenter(this._getMapCenter());
            }
        }
        this.position = newPosition;
        $('#' + this.toolbar.getIds()['location']).removeClass('ui-btn-active');
    },

    _getPositionFeatureArr: function(point, accuracy) {
        return [ new OpenLayers.Feature.Vector(point, {}, {
            fillColor: '#c800ff', fillOpacity: 0.4, strokeColor: '#c800ff', strokeWidth: 1.5, pointRadius: 7 }),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(point.x, point.y),
                    accuracy / 2,
                    100,
                    0
            ),
            {},
            { fillColor: '#c800ff', fillOpacity: 0.3, strokeWidth: 0 })
        ];
    },

    // move center for small devices to see more of the city
    _getMapCenter: function() {
        var box = this.map.restrictedExtent;
        var lon = (box.left + box.right) / 2, lat = (box.top + box.bottom) / 2;
        var s = this.map.getSize();
        if (s.w >= 1000 && s.h >= 750) {
            return new OpenLayers.LonLat(lon, lat);
        }
        if (s.w < 1000) {
            lon -= 2000;
        }
        for(var i = 9; i >= 4; i--) {
            if (s.w < i * 100) {
                lon -= 150;
            }
        }
        if (s.h < 750) {
            lat -= 2200;
        }
        for(var i = 6.5; i >= 3.5; i--) {
            if (s.h < i * 100) {
                lat -= 150;
            }
        }
        return new OpenLayers.LonLat(lon, lat);
    },

    _getZoomLevel: function(accuracy) {
        var offset = accuracy != undefined ? 3 : this.map.resolutions.length;
        if (accuracy >= 20) {
            offset++;
        } 
        if (accuracy >= 50) {
            offset++;
        } 
        if (accuracy >= 100) {
            offset++;
        }
        if (accuracy >= 300) {
            offset++;
        } 
        if (accuracy >= 500) {
            offset++;
        }
        return this.map.resolutions.length - offset;
    },

    /**
     * Reloads the Meldungen layer
     */
    reloadMeldungen: function() {
        this.layers.meldungen.refresh({force: true});
    },

    /**
     * Adds a layer to the map.
     */
    addLayer: function(layer) {
        this.map.addLayer(layer);
        // Move layer to top...
        this.map.setLayerZIndex(layer, this.map.layers.length)
    },

    /**
     * Adds a control to the map.
     */
    addControl: function(control) {
        this.map.addControl(control);
    },

    /**
     * Switches to next base layer.
     */
    toggleBaseLayer: function(callerId) {
        this.view.toggleBaseLayer();
        var next = this.view.nextBaselayer();
        $('#' + callerId + ' span.ui-btn-text').html(next.name);
    },

    /**
     * Zoom in.
     */
    zoomIn: function() {
        this.map.zoomIn();
    },

    /**
     * Zoom out.
     */
    zoomOut: function() {
        this.map.zoomOut();
    },

    /**
     * Set new map center.
     */
    setCenter: function(point) {
        this.map.setCenter(point);
    },

    /**
     * Unselect all selected features.
     */
    unselect: function() {
        this.controls.select.unselectAll();
    },

    /**
     * Executes a search.
     */
    suche: function() {
        // Spinner zeigen
        // Suchen
        // Spinner schließen
        // Zoomen oder melden
    },

    /**
     * Adjusts map height to viewport.
     */
    fitMap: function() {
        this._fitDocument();
        $('#' + this.view.id).css({
            top: $('#' + M.ViewManager.getView('mapPage', 'toolbar').id).height(),
            bottom: 0,
            margin: 0
        }).parent().css({
            'box-sizing': 'border-box',
            height: '100%'
        });

        // force update because of wrong size values during initialization
        this.map.updateSize();
    },

    /**
     * Adjust document height for some mobile devices and browsers.
     */
    _fitDocument: function() {
        var ua = navigator.userAgent, av = navigator.appVersion;
        if (ua.match(/firefox/i) && av.match(/android/i)) {
            document.body.style.height = window.outerHeight + 'px';
        }
    },

    search: function() {
        this.switchToPage(M.ViewManager.getPage('suchenPage'), 'slidedown', true, false);
    },

    zoomTo: function(bbox, max) {
        var extent = OpenLayers.Bounds.fromArray(bbox);
        var zoom = this.map.getZoomForExtent(extent);
        this.map.setCenter(extent.getCenterLonLat(), Math.min(max, zoom));
    }
});
