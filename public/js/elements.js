function InlineWidget(){

	this.isOptionsFormLoaded = false;

    this.init = function(){
        if (typeof(this.onInit) === 'function'){
            this.onInit();
        }
    };

    this.initWidget = function(widget, regionId, callback){

        var handler = this;

        this.loadLang(function(){
            if (typeof(handler.onInitWidget) === 'function'){
                handler.onInitWidget(widget, regionId);
            }
            callback(widget);
        });

        if (typeof(this.onClick) === 'function'){
            this.dom(widget).click(function(e){
                e.stopPropagation();
                e.preventDefault();
                handler.onClick(widget, regionId);
            });
        }

    };

    this.createWidget = function(regionId, widget, callback){

        var handler = this;

        this.loadLang(function(){
            if (typeof(handler.onCreateWidget) === 'function'){
                widget = handler.onCreateWidget(widget, regionId);
            }
            callback(widget);
        });

        if (typeof(this.onClick) === 'function'){
            this.dom(widget).click(function(e){
                e.stopPropagation();
                e.preventDefault();
                handler.onClick(widget, regionId);
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

	this.openOptionsForm = function(regionId, widgetId){

        var handler = this;
        var options = cms.getWidgetOptions(regionId, widgetId);

        var formSettings = {
			id: this.getName() + '-options',
            title: cms.lang("widgetOptions") + ': ' + this.getTitle(),
			values: options,
			source: {
				module: 'widgets',
				action: 'loadOptionsForm',
                data: {
                    handler: this.getName()
                }
			},
			buttons: {
				ok: cms.lang("apply"),
			},
			onSubmit: function(options, form){
				handler.saveOptions(regionId, widgetId, options, form);
			}
		};

        if (typeof(this.getOptionsFormSettings) !== 'undefined'){
            formSettings = $.extend(formSettings, this.getOptionsFormSettings(regionId, widgetId));
        }

        cms.openForm(formSettings);

	};

	this.saveOptions = function(regionId, widgetId, newOptions, form){

        var widget = cms.getWidget(regionId, widgetId);

        widget.domId = 'inlinecms-widget-' + regionId + widget.id;

        newOptions = $.extend({}, newOptions, this.applyOptions(widget, newOptions, form));

		cms.setWidgetOptions(regionId, widgetId, newOptions);

	};

	this.applyOptions = function(widget, options, form){};

    this.dom = function(widget){

        return $('#'+widget.domId+' .inlinecms-content', cms.pageFrame);

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

