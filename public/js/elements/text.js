editor.registerElementHandler('text', new function() {

    Element.apply(this, arguments);

    this.editor;
    this.editors = {};

	this.getName = function(){
		return 'text';
	};

	this.getIcon = function(){
		return "fa-font";
	};

	this.getToolbarButtons = function(){
		return {
			options: false
		};
	};

    this.onClick = false;

  //   this.onInit = function(){

  //       this.editor = $('#page-frame').prop('contentWindow').CKEDITOR;

  //       this.editor.dtd.$removeEmpty['i'] = false;

  //       this.editor.config = $.extend(this.editor.config, {
  //           language: cms.getLanguage(),
  //           allowedContent: true,
  //           fillEmptyBlocks: false,
  //           autoParagraph: false,
  //           stylesSet: false,
  //           startupShowBorders: false,
  //       });

		// this.editor.disableAutoInline = true;

  //   };

	this.onInitElement = function(elementDom){
        elementDom.find('.inlinecms-content').addClass('jodelTextarea')
        editor.editorFrame.get(0).contentWindow.initTinyMCE();
	};

	this.onCreateElement = function(elementDom){
        elementDom.find('.inlinecms-content').addClass('jodelTextarea')
        editor.editorFrame.get(0).contentWindow.initTinyMCE();
        let tinymceID = elementDom.find('.jodelTextarea').attr('id');
        editor.editorFrame.get(0).contentWindow.tinymce.EditorManager.get(tinymceID).focus();
		//return widget;
	};

	this.getContent = function(widget){

        return this.getEditorContent(widget.domId);

	};

    this.appendEditor = function (id, itemDom, defaultHtml){

        if (typeof(defaultHtml) === 'string'){
            itemDom.html(defaultHtml);
        }

        var dom = itemDom.prop('contentEditable', true)[0];

        var instance = this.editor.inline(dom);

        instance.on('change', function(){
            cms.setChanges();
        });

        this.editors[id] = instance.name;

    };

    this.getEditorContent = function (id){

        if (typeof(this.editors[id]) === 'undefined'){ return ''; }

        return this.editor.instances[ this.editors[id] ].getData();

    };

});
