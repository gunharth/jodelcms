editor.registerElementHandler('form', new function() {

    Element.apply(this, arguments);

    this.getName = function() {
        return 'form';
    };

    this.getIcon = function() {
        return "fa-envelope-o";
    };

    this.defaultOptions = {
        "email_type": "default",
        "email": "",
        "subject": "",
        "response": "Thank you!",
        "submit": "Submit",
        "fields": []
    };

    this.getToolbarButtons = function() {
        var handler = this;
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

                //  "email_type": "default",
                // "email": "",
                $('.subject', form).val(options.subject);
                $('.submit', form).val(options.submit);
                $('.response', form).val(options.response);
            }
        };
    };

    this.onCreateElement = function(elementDom) {
        this.openOptionsForm(elementDom);
    };

    this.applyOptions = function(elementDom, form) {

        editor.showLoadingIndicator();

        var elementId = elementDom.attr('id');
        var elementIdDb = elementId.replace('element_', '');

        var options = this.getOptions(elementId);
        options['fields'] = [];

        $('.fields-list .form-field', form).each(function(index) {
            var field = $(this);
            var title = $('input.field-title', field).val();
            if (!title) { return; }
            var type = $('select.field-type', field).val();
            var isMandatory = $('.b-mandatory', field).hasClass('active');
            options['fields'].push({
                type: type,
                title: title,
                isMandatory: isMandatory
            });
        });

        //  "email_type": "default",
        // "email": "",
        options['subject'] = $('.subject', form).val();
        options['submit'] = $('.submit', form).val();
        options['response'] = $('.response', form).val(); 

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
