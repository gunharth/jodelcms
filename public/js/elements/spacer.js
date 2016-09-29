editor.registerElementHandler('spacer', new function() {

    Element.apply(this, arguments);

    this.editor;

	this.getName = function() {
		return 'spacer';
	};

	this.getIcon = function() {
		return "fa-arrows-v";
	};

    this.getDefault = function() {
        return { 'size': '25' };
    }

    this.getToolbarButtons = function() {
		let handler = this;
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

	this.onClick = false;

	this.onCreateElement = function(elementDom) {
        this.openOptionsForm(elementDom);
	};

    this.applyOptions = function(elementDom, options, form) {
        let size = $('#size',form).val();
        let elementId = elementDom.attr('id');
        editor.editorFrame.get(0).contentWindow.options[elementId]['size'] = size;
        $('div.jodelcms-content div', elementDom).css('height', Number(size)+'px');
    };

});