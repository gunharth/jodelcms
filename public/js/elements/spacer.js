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
    	form = form.serializeArray();
    	console.log(options.size)
        //var dom = this.dom(widget);
        //var elementDom = $('#element_'+elementId, editor.editorIFrame);
        //elementDom.hide();
        //if (!options.size) { options.size = 20; }

        $('div.jodelcms-content div', elementDom).css('height', Number(80)+'px').css('width', Number(80)+'px');

    };

});
