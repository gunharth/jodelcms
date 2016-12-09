editor.registerElementHandler('map', new function() {

    Element.apply(this, arguments);

    //this.isApiLoaded = false;
    this.isGoogleMapsApiLoadInProgress = false;
    this.callbacks = [];

    this.mapsObjects = {};

    this.getName = function() {
        return 'map';
    };

    this.getIcon = function() {
        return "fa-globe";
    };

    this.defaultOptions = {
        width: '100%',
        height: 200,
        lat: '48.856614',
        lng: '2.3522219',
        zoom: 12,
        icon: '//maps.gstatic.com/mapfiles/markers2/marker.png',
        styles: '[]'
    };

    this.getToolbarButtons = function() {
        var handler = this;
        return {
            options: {
                icon: "fa-gear",
                click: function(regionId, widgetId) {
                    handler.openOptionsForm(regionId, widgetId);
                }
            }
        };
    };

    this.getOptionsFormSettings = function() {
        var handler = this;
        return {
            onCreate: function(form) {
                $('a.find-coords', form).click(function(e) {
                    e.preventDefault();
                    editor.showPromptDialog('Enter Address', 'address', function(address) {
                        handler.loadApi(function(google) {
                            var geocoder = new google.maps.Geocoder();
                            geocoder.geocode({ 'address': address }, function(results, status) {
                                if (status !== google.maps.GeocoderStatus.OK) {
                                    editor.showMessageDialog('addressError');
                                    return;
                                }
                                var lat = results[0].geometry.location.lat();
                                var lng = results[0].geometry.location.lng();
                                $('#lat', form).val(lat);
                                $('#lng', form).val(lng);
                            });
                        });
                    });
                });
                $('a.current-location', form).click(function(e) {
                    e.preventDefault();
                    var startPos;
                    var geoSuccess = function(position) {
                        startPos = position;
                        $('#lat', form).val(startPos.coords.latitude);
                        $('#lng', form).val(startPos.coords.longitude);
                    };
                    navigator.geolocation.getCurrentPosition(geoSuccess);
                });
            },
            onShow: function(form, options) {
                if (!options) { return; }

                $('input[name=width]').val(options.width);
                $('input[name=height]').val(options.height);
                $('input[name=lat]').val(options.lat);
                $('input[name=lng]').val(options.lng);
                $('input[name=zoom]').val(options.zoom);
                $('input[name=icon]').val(options.icon);
                $('textarea[name=styles]').val(options.styles);
            }
        };
    };

    this.onClick = false;

    this.onInitElement = function(elementDom) {
        var elementId = elementDom.attr('id');
        var mapId = elementId + '_map';

        var handler = this;

        this.loadApi(function(google) {

            handler.initElementMap(mapId, elementDom, google);

        });

    };

    this.initElementMap = function(mapId, elementDom, google) {

        var elementId = elementDom.attr('id');

        var options = this.getOptions(elementId);

        var center = new google.maps.LatLng(options.lat, options.lng);

        var map = new google.maps.Map(elementDom.find('#' + mapId)[0], {
            center: center,
            zoom: Number(options.zoom),
            styles: JSON.parse(options.styles)
        });

        map.marker = new google.maps.Marker({
            map: map,
            position: center,
            //animation: google.maps.Animation.DROP,
            icon: options.icon,
            draggable: true
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {
            options.zoom = map.getZoom();
            editor.setChanges();
        });

        google.maps.event.addListener(map.marker, 'dragend', function() {
            var coords = map.marker.getPosition();
            options.lat = coords.lat();
            options.lng = coords.lng();
            map.setCenter(coords);
        });

        this.mapsObjects[mapId] = map;

    };


    this.onCreateElement = function(elementDom) {
        var elementId = elementDom.attr('id');
        var mapId = elementId + '_map';

        var handler = this;

        this.loadApi(function(google) {

            handler.initElementMap(mapId, elementDom, google);

        });
        this.openOptionsForm(elementDom);
    };


    this.applyOptions = function(elementDom, form) {

        var elementId = elementDom.attr('id');
        var mapObject = this.mapsObjects[elementId + '_map'];

        var width = $('#width', form).val();
        var height = $('#height', form).val();
        var zoom = $('#zoom', form).val();
        var lat = $('#lat', form).val();
        var lng = $('#lng', form).val();
        var icon = $('#icon', form).val();
        var styles = $('#styles', form).val();

        var options = this.getOptions(elementId);

        options['width'] = width;
        options['zoom'] = zoom;
        options['lat'] = lat;
        options['lng'] = lng;
        
        if(styles == "") {
            styles = '[]';
        }
        options['styles'] = styles;
        options['icon'] = icon;

        if (height) {
            options['height'] = height;
            $('#' + elementId + '_map', elementDom).css('height', Number(height) + 'px');
        } else {
            options['height'] = 200;
            $('#' + elementId + '_map', elementDom).css('height', Number(200) + 'px');
        }

        if (width) {
            options['width'] = width;
            $('#' + elementId + '_map', elementDom).css('width', width);
        } else {
            options['width'] = '100%';
            $('#' + elementId + '_map', elementDom).css('width', '100%');
        }

        this.loadApi(function(google) {
            var center = new google.maps.LatLng(lat, lng);
            google.maps.event.trigger(mapObject, "resize");
            mapObject.setZoom(Number(zoom));
            mapObject.setCenter(center);
            mapObject.marker.setPosition(center);
            mapObject.marker.setIcon(icon);
            mapObject.setOptions({styles: JSON.parse(styles)});
        });

    };

    this.loaded = function() {

        editor.isGoogleMapsApiLoaded = true;
        this.isGoogleMapsApiLoadInProgress = false;

        var google = window.frames[0].google;

        while (this.callbacks.length > 0) {
            var callback = this.callbacks.pop();
            callback(google);
        }

    };

    this.loadApi = function(callback) {
        //if (editor.isGoogleMapsApiLoaded) {
        var google = window.frames[0].google;
        callback(google);
        return;
        //}

        this.callbacks.push(callback);

        // if (!this.isGoogleMapsApiLoadInProgress){
        //     editor.injectScript('http://maps.googleapis.com/maps/api/js?callback=parent.editor.elementHandlers.map.loaded&language=en&key=AIzaSyCRqfUKokTWoFg77sAhHOBew_NLgepcTOM');
        //     this.isGoogleMapsApiLoadInProgress = true;
        // }

    };

});
