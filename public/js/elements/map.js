editor.registerElementHandler('map', new function() {

    Element.apply(this, arguments);

    this.getName = function() {
        return 'map';
    };

    this.getIcon = function() {
        return "fa-globe";
    };

    this.getDefault = function() {
        return {
            "email_type": "default",
            "email": "",
            "subject": "",
            "thanks_msg": "",
            "submit": "fsdfsfd",
            "style": "s-horizontal",
            "fields": []
        };
    }

    this.getToolbarButtons = function() {
        let handler = this;
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
                $('.fields-list', form).sortable({
                    handle: '.drag-handle'
                });
                $('.f-email-type select', form).on('change', function() {
                    $('.f-email', form).toggle($(this).val() == 'custom');
                }).change();
                form.on('click', '.actions .b-mandatory', function(e) {
                    e.preventDefault();
                    $(this).toggleClass('active');
                });
                form.on('click', '.actions .b-delete', function(e) {
                    e.preventDefault();
                    $(this).parents('.form-field').remove();
                });
                $('.f-add button', form).click(function(e) {
                    e.preventDefault();
                    var list = $('.fields-list', form);
                    $('.field-template', form).clone().removeClass('field-template').addClass('form-field').appendTo(list);
                });
            },
            onShow: function(form, options) {
                $('.f-email-type select', form).change();
                var list = $('.fields-list', form);
                $('.form-field', list).remove();
                if (!options || !options.fields) {
                    return; }
                $.each(options.fields, function(index, field) {
                    var item = $('.field-template', form).clone().removeClass('field-template').addClass('form-field').appendTo(list);
                    $('.field-title', item).val(field.title);
                    $('.field-type', item).val(field.type);
                    if (field.isMandatory) {
                        $('.b-mandatory', item).addClass('active');
                    }
                    list.append(item);
                });
            }
        };
    };

    this.onClick = false;

    this.onCreateElement = function(elementDom) {
        this.openOptionsForm(elementDom);
    };

    this.applyOptions = function(elementDom, options, form) {
        editor.showLoadingIndicator();
        var elementId = elementDom.attr('id');
        editor.editorFrame.get(0).contentWindow.options[elementId]['fields'] = [];

        $('.fields-list .form-field', form).each(function(index) {
            var field = $(this);
            var title = $('input.field-title', field).val();
            if (!title) { return; }
            var type = $('select.field-type', field).val();
            var isMandatory = $('.b-mandatory', field).hasClass('active');
            editor.editorFrame.get(0).contentWindow.options[elementId]['fields'].push({
                type: type,
                title: title,
                isMandatory: isMandatory
            });
        });

        options = editor.editorFrame.get(0).contentWindow.options[elementId];
        var elementIdDb = elementId.replace('element_', '');

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: '/admin/element/form/' + elementIdDb + '/apply', // the url where we want to POST
            data: { 'options': JSON.stringify(options) },
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done((data) => {
            elementDom.find('form').replaceWith(data);
            editor.hideLoadingIndicator();
        });
        return options;
    };

});
