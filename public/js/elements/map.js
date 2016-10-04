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
        zoom: 12
    };

    this.getToolbarButtons = function() {
        let handler = this;
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
        let handler = this;
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
                        // document.getElementById('startLat').innerHTML = startPos.coords.latitude;
                        // document.getElementById('startLon').innerHTML = startPos.coords.longitude;
                        $('#lat', form).val(startPos.coords.latitude);
                        $('#lng', form).val(startPos.coords.longitude);
                    };
                    navigator.geolocation.getCurrentPosition(geoSuccess);
                });
            }
        };
    };

    this.onClick = false;

    this.onInitElement = function(elementDom) {
        let elementId = elementDom.attr('id');
        let mapId = elementId + '_map';

        let handler = this;

        this.loadApi(function(google) {

            handler.initElementMap(mapId, elementDom, google);

        });

    };

    this.initElementMap = function(mapId, elementDom, google) {

        let elementId = elementDom.attr('id');

        options = editor.editorFrame.get(0).contentWindow.options[elementId];

        var center = new google.maps.LatLng(options.lat, options.lng);

        var map = new google.maps.Map(elementDom.find('#' + mapId)[0], {
            center: center,
            zoom: Number(options.zoom)
        });

        map.marker = new google.maps.Marker({
            map: map,
            position: center,
            draggable: true
        });

        // google.maps.event.addListener(map, 'zoom_changed', function() {
        //     map.elementDom.options.zoom = map.getZoom();
        // });

        // google.maps.event.addListener(map.marker, 'dragend', function() {
        //     var coords = map.marker.getPosition();
        //     map.elementDom.options.lat = coords.lat();
        //     map.elementDom.options.lng = coords.lng();
        //     map.setCenter(coords);
        // });

        //map.elementDom = elementDom;

        this.mapsObjects[mapId] = map;

    };


    this.onCreateElement = function(elementDom) {
        this.openOptionsForm(elementDom);
    };

    this.applyOptions = function(elementDom, options, form) {
        //editor.showLoadingIndicator();
        //console.log(options)
        var elementId = elementDom.attr('id');
        //var mapObject = $('#' + elementId + '_map', elementDom);
        var mapObject = this.mapsObjects[elementId + '_map'];
        //alert(elementId);
        //var mapId = $('#' + elementId + '_map', $("#editorIFrame"));
        //
        let width = $('#width', form).val();
        let height = $('#height', form).val();
        let zoom = $('#zoom', form).val();
        let lat = $('#lat', form).val();
        let lng = $('#lng', form).val();

        editor.editorFrame.get(0).contentWindow.options[elementId]['width'] = width;
        editor.editorFrame.get(0).contentWindow.options[elementId]['zoom'] = zoom;
        editor.editorFrame.get(0).contentWindow.options[elementId]['lat'] = lat;
        editor.editorFrame.get(0).contentWindow.options[elementId]['lng'] = lng;

        if (height) {
            editor.editorFrame.get(0).contentWindow.options[elementId]['height'] = height;
            $('#' + elementId + '_map', elementDom).css('height', Number(height) + 'px');
            //mapId.css({height: options.height});
        } else {
            editor.editorFrame.get(0).contentWindow.options[elementId]['height'] = 200;
            $('#' + elementId + '_map', elementDom).css('height', Number(200) + 'px');
        }

        this.loadApi(function(google) {
            var center = new google.maps.LatLng(lat, lng);
            google.maps.event.trigger(mapObject, "resize");
            mapObject.setZoom(Number(zoom));
            mapObject.setCenter(center);
            mapObject.marker.setPosition(center);

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
