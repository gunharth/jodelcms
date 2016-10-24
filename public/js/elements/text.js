editor.registerElementHandler('text', new function() {

    Element.apply(this, arguments);

    this.editor;
    this.editors = {};

    this.getName = function() {
        return 'text';
    };

    this.getIcon = function() {
        return "fa-font";
    };

    this.defaultOptions = {};

    this.getToolbarButtons = function() {
        return {
            options: false
        };
    };

    this.onClick = false;

    this.onInitElement = function(elementDom) {
        var elementId = elementDom.attr('id');
        editor.editorFrame.get(0).contentWindow.initTinyMCE('#' + elementId + '_content');
    };

    this.onCreateElement = function(elementDom) {
        elementDom.attr('data-type', 'text');
        var elementId = elementDom.attr('id');
        var getTiny = editor.editorFrame.get(0).contentWindow;
        getTiny.initTinyMCE('#' + elementId + '_content');
        setTimeout(function() {
            getTiny.tinyMCE.EditorManager.get(elementId + '_content').focus();
        }, 500)
    };

    this.deleteElement = function(elementDom) {
        var elementId = elementDom.attr('id');  
        editor.editorFrame.get(0).contentWindow.tinymce.remove('#' + elementId + '_content');
        elementDom.remove();
    };

});
