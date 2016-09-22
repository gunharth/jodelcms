editor.registerElementHandler('spacer', new function() {

    Element.apply(this, arguments);

    this.editor;

	this.getName = function(){
		return 'spacer';
	};

	this.getIcon = function(){
		return "fa-arrows-v";
	};

    this.getToolbarButtons = function(){

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

    this.getOptionsFormSettings = function(){

        var handler = this;

        return {
            onShow: function(form, options){

                if (!options || !options.size) { return; }

                $('#size', form).val(options.size);

            }
        };

    };

	this.onClick = false;

	this.onCreateElement = function(elementDom){

        //var dom = this.dom(widget);
        elementDom.attr('data-type','spacer');
        var content = $('<div></div>').css('height', '25px').css('width', '25px');
        var dom = elementDom.find('.jodelcms-content');
        dom.append(content);

		//return widget;

	};

    this.applyOptions = function(elementDom, options, form){
    	//let form = form.serializeArray();
    	//console.log(options.values.size)
        //var dom = this.dom(widget);
        //var elementDom = $('#element_'+elementId, editor.editorIFrame);
        //elementDom.hide();
        //if (!options.size) { options.size = 20; }
        
        let size = $('#size',form).val();

        var elementId = elementDom.attr('id');

        editor.editorFrame.get(0).contentWindow.options[elementId]['size'] = size;



        $('div.jodelcms-content div', elementDom).css('height', Number(size)+'px');

    };

});
