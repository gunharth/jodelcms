function Element(){

	this.isOptionsFormLoaded = false;

    // this.init = function(){
    //     if (typeof(this.onInit) === 'function'){
    //         this.onInit();
    //     }
    // };

    this.initElement = function(elementDom, callback){

        var handler = this;

        //this.loadLang(function(){
            if (typeof(handler.onInitElement) === 'function'){
                // handler.onInitWidget(widget, regionId);
                handler.onInitElement(elementDom);
            }
            callback(elementDom);
        //});

        if (typeof(this.onClick) === 'function'){
            elementDom.click(function(e){
                e.stopPropagation();
                e.preventDefault();
                handler.onClick(elementDom);
            });
        }

    };

    this.createElement = function(regionId, elementDom, callback){

        var handler = this;

        //this.loadLang(function(){
            if (typeof(handler.onCreateElement) === 'function'){
                element = handler.onCreateElement(elementDom, regionId);
            }
            callback(elementDom);
        //});

        if (typeof(this.onClick) === 'function'){
            elementDom.click(function(e){
                e.stopPropagation();
                e.preventDefault();
                handler.onClick(elementDom, regionId);
            });
        }

    };

    this.loadLang = function(callback){

        if (typeof(this.lang) === 'function') {
            callback();
            return;
        }

        this.lang = function(){};

        var handler = this;

        cms.loadWidgetLang(this.getName(), function(phrases){

            handler.langPhrases = phrases;

            handler.lang = function(phraseId, replacements){

                if (typeof(this.langPhrases[phraseId]) === 'undefined'){
                    return phraseId;
                }

                var phrase = this.langPhrases[phraseId];

                if (typeof(replacements) !== 'undefined'){
                    for (var id in replacements){
                        phrase = phrase.replace(new RegExp('\{'+id+'\}', 'g'), replacements[id]);
                    }
                }

                return phrase;

            };

            callback();

        });

    };

	this.openOptionsForm = function(elementDom){

        var handler = this;
        var elementId = elementDom.attr('id').replace('element_', '');

        //var options = editor.getElementOptions();
        var options = editor.getElementOptions(elementId);

        var formSettings = {
			id: this.getName() + '-options',
            title: 'Settings: ' + this.getTitle(),
            modal: true,
            url: '/admin/element/' + this.getName() + '/' + elementId + '/settings'+ '/' + editor.editorLocale,
            //type: 'ajax',
			values: options,
			// source: {
			// 	module: 'widgets',
			// 	action: 'loadOptionsForm',
   //              data: {
   //                  handler: this.getName()
   //              }
			// },
			buttons: {
				ok: 'Apply',
			},
			onSubmit: function(options, form){
                //console.log(elementId)
				//handler.applyOptions(elementDom, options, form);
                handler.saveOptions(elementDom, options, form);
			}
		};

        if (typeof(this.getOptionsFormSettings) !== 'undefined'){
            formSettings = $.extend(formSettings, this.getOptionsFormSettings(elementDom));
        }
        //alert(formSettings)

        editor.openDialog(formSettings);


        // this.openDialog({

        //     modal: true,
        //     url: '/'+this.editorLocale+'/admin/menu/create/' + menu_type_id,
        //     type: 'ajax',
        //     onAfterShow: () => {
        //         this.renderMenuTypeSelect();
        //     },
        //     callback: () => {
        //         this.loadMenu(menu_type_id);
        //     },
        //     buttons: {
        //         ok: 'Create',
        //         Cancel: () => {
        //             this.dialog.dialog("close");
        //         }
        //     }
        // });

	};

	this.saveOptions = function(elementDom, options, form){
        //console.log(elementId)
  //       var widget = cms.getWidget(regionId, widgetId);

  //       widget.domId = 'jodelcms-element-' + regionId + widget.id;

  //       newOptions = $.extend({}, newOptions, this.applyOptions(widget, newOptions, form));

		// cms.setWidgetOptions(regionId, widgetId, newOptions);

	};

	//this.applyOptions = function(widget, options, form){};

    this.dom = function(widget){

        return $('#'+widget.domId+' .jodelcms-content', this.pageFrame);

    };

    this.runBackend = function(action, params, callback){

        if (typeof(params) === 'undefined') {
            params = {};
        }

        params._widgetId = this.getName();
		params._widgetAction = action;

        cms.runModule('widgets', 'run', params, function(result){
            if (typeof(callback) === 'function'){
				callback(result);
			}
        });

    };

    this.onClick = function(widget, regionId){

        this.openOptionsForm(regionId, widget.id);

    };

}

