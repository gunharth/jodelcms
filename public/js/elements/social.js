editor.registerElementHandler('social', new function() {

    Element.apply(this, arguments);

    this.getName = function() {
        return 'social';
    };

    this.getIcon = function() {
        return "fa-share-square-o";
    };

    this.defaultOptions = {
        "showLabel": false,
        "showCount": false,
        "shareIn": "popup",
        shares: ["twitter", "facebook", "googleplus", "linkedin", "pinterest", "stumbleupon", "whatsapp"]
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
        return {
            onCreate: function(form) {
                
            },
            onShow: function(form, options) {
                if (!options) { return; }
                
                $('input[name=showLabel]').prop('checked', options.showLabel);
                $('input[name=showCount]').prop('checked', options.showCount);
                $.each(options.shares, function(index, field) {
                    $('#'+field, form).prop('checked', true);
                });
            }
        };
    };

    this.onCreateElement = function(elementDom) {
        this.openOptionsForm(elementDom);
    };

    this.applyOptions = function(elementDom, form) {

        editor.showLoadingIndicator();

        var elementId = elementDom.attr('id');

        var options = this.getOptions(elementId);

        options['showLabel'] = $('#showLabel', form).prop('checked');
        options['showCount'] = $('#showCount', form).prop('checked');

        options['shares'] = [];

        $('.shares', form).each(function(index) {
            var field = $(this);
            if(field.prop('checked')) {
                var name = field.attr('name');
                options['shares'].push(name);
            }
        });

        editor.editorFrame.get(0).contentWindow.reInitJsSocials(elementId+'_social',options);

        editor.hideLoadingIndicator();

    };

});
