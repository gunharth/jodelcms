editor.registerElementHandler('spacer', new function() {

    Element.apply(this, arguments);

    this.editor;

	this.getName = function() {
		return 'spacer';
	};

	this.getIcon = function() {
		return "fa-arrows-v";
	};

    this.defaultOptions = { 'size': '25' };

    this.getToolbarButtons = function() {
		var handler = this;
        return {
			options: {
                icon: "fa-gear",
                click: function(elementDom){
					handler.openOptionsForm(elementDom);
				}
			}
		};
	};

    this.getOptionsFormSettings = function() {
        return {
            onShow: function(form, options){
                if (!options || !options.size) { return; }
                $('#size', form).val(options.size);
            }
        };
    };

	this.onCreateElement = function(elementDom) {
        this.openOptionsForm(elementDom);
	};

    this.applyOptions = function(elementDom, form) {
        var size = $('#size',form).val();
        var elementId = elementDom.attr('id');

        options = this.getOptions(elementId);
        options['size'] = size;

        $('div.jodelcms-content div', elementDom).css('height', Number(size)+'px');
    };

});