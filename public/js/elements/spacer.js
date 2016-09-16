editor.registerElementHandler('spacer', new function() {

    Element.apply(this, arguments);

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
                icon: "fa-arrows-v",
                click: function(elementDom){
					handler.openOptionsForm(elementDom);
				}
			}
		};

	};

	this.onCreateElement = function(elementDom){

        //var dom = this.dom(widget);
        elementDom.attr('data-type','spacer');
        var content = $('<div></div>').css('height', '25px').css('width', '25px');
        var dom = elementDom.find('.inlinecms-content');
        dom.append(content);

		//return widget;

	};

    this.applyOptions = function(widget, options){

        var dom = this.dom(widget);

        if (!options.size) { options.size = 20; }

        $('div', dom).css('height', Number(options.size)+'px').css('width', Number(options.size)+'px');

    };

});
