(function (exports) {
'use strict';

var Editor = function Editor() {
    this.editorPanel = $('#editor-panel');
    this.editorPanelCollapse = $('#modal-toggle');
    this.page_id = 0;
    this.editorFrame = $("#editorIFrame");
    this.data = '';
    this.collection;
    this.collection_id = 0;
    this.editorLocale = 'en';
    this.editorPinned = true;
    //this.elementsList = ["text","image","gallery","video","file","form","map","share","spacer","code"];
    this.elementsList = ['text', 'spacer', 'form', 'map', 'social'];
    this.elementHandlers = {};
    this.elementOptions = {};
    this.isGoogleMapsApiLoaded = false;
    this.elementsToDelete = [];
    this.hasUnsavedChanges = false;
};

Editor.prototype.setChanges = function setChanges () {
    this.hasUnsavedChanges = true;
    $('#saveMe').show();
    //$('.btn-save', this.panel).addClass('glow').find('i').removeClass('fa-check').addClass('fa-exclamation-circle');
};

Editor.prototype.hasChanges = function hasChanges () {
    return this.hasUnsavedChanges;
};

Editor.prototype.noChanges = function noChanges () {
    this.hasUnsavedChanges = false;
    $('#saveMe').hide();
    //$('.btn-save', this.panel).removeClass('glow').find('i').removeClass('fa-exclamation-circle').addClass('fa-check');
};

Editor.prototype.showLoadingIndicator = function showLoadingIndicator () {
    $('#editor-loading').show();
};

Editor.prototype.hideLoadingIndicator = function hideLoadingIndicator () {
    $('#editor-loading').fadeOut();
};

Editor.prototype.injectScript = function injectScript (url, callback) {

    var doc = this.editorFrame.get(0).contentWindow.document;
    var head = doc.getElementsByTagName('body')[0];
    var script = doc.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);

};

Editor.prototype.initPanel = function initPanel () {
        var this$1 = this;

        
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    this.editorFrame.on('load', function () {
        $('a[target!=_blank]', this$1.editorFrame.contents()).attr('target', '_top');
        this$1.initRegions();
        // alert(JSON.stringify(this.editorFrame.get(0).contentWindow.eoptions));

    });
        
    //Save Keyboard shortcut if editor is in focus
    $(document).keydown(function (e) {
        if ((e.ctrlKey || e.metaKey) && e.which == 83) {
            e.preventDefault();
            this$1.editorFrame.get(0).contentWindow.saveContent();
            //this.hasUnsavedChanges = false;
        }
    });

    this.editorPanel.draggable({
        handle: ".modal-header",
        iframeFix: true,
        cursor: "move",
        containment: "document",
        stop: function () {
            this$1.savePanelState();
            this$1.editorPanel.css({ height: 'auto' });
        }
    });

    this.buildElementsList();


    /**
     * Boostrap tooltips
     */
    // $('[data-toggle="tooltip"]').tooltip({
    // animation: false
    // }); 

    $(window).resize(function () {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var left = $("#editor-panel").position().left;
        var width = $("#editor-panel").width();
        var top = $("#editor-panel").position().top;
        var height = $("#editor-panel").height();
        if (windowWidth < left + width) {
            var newLeft = left - ((left + width) - windowWidth);
            if (newLeft < 0) { newLeft = 0; }
            $("#editor-panel").css({ left: newLeft });
        }
        if (windowHeight < top + height) {
            var newTop = top - ((top + height) - windowHeight);
            if (newTop < 0) { newTop = 0; }
            $("#editor-panel").css({ top: newTop });
        }
        if(this$1.editorPinned) {
            this$1.editorFrame.width($(document).width()-340);
        }
        this$1.savePanelState();
    });

    window.onbeforeunload = function () {
        if (!this$1.hasChanges()){ return; }
        return 'pageOutConfirm';
    };

    $('#saveMe').on('click', function (e) {
        e.preventDefault();
        this$1.editorFrame.get(0).contentWindow.saveContent();
    });

    $('.modal-header select', this.editorPanel).on('change', function (e) {
        e.preventDefault();
        this$1.editorLocale = $(e.target).val();
        this$1.loadPages();
        this$1.loadMenu(this$1.getMenuID());
    });

    $('.modal-header .tb-collapse', this.editorPanel).on('click', function (e) {
        e.preventDefault();
        this$1.editorPanelCollapse.slideToggle(250, function () {
            this$1.savePanelState();
        });
        $('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
    });

    $('.modal-header .tb-toggle', this.editorPanel).on('click', function (e) {
        e.preventDefault();
        this$1.editorPanel.toggleClass('pinned');
        this$1.editorFrame.toggleClass('pinned');
        //this.editorPanelCollapse.slideToggle(250, () => {
            this$1.savePanelState();
            this$1.restorePanelState();
        //});
        $('.modal-header .tb-toggle i').toggleClass('fa-lock').toggleClass('fa-unlock');
    });

    $('.modal-header .tb-collapse-right', this.editorPanel).on('click', function (e) {
        e.preventDefault();
        // this.editorPanelCollapse.slideToggle(250, () => {
        // this.savePanelState();
        // });
        this$1.editorPanel;
        // Set the effect type
        var effect = 'slide';

        // Set the options for the effect type chosen
        var options = { direction: 'right' };

        // Set the duration (default: 400 milliseconds)
        var duration = 500;

        this$1.editorPanel.toggle(effect, options, duration);
        this$1.editorFrame.animate({
        width: "100%"
      }, duration);
        $('.modal-header .tb-collapse i').toggleClass('fa-caret-right').toggleClass('fa-caret-left');
    });

    $('.modal-header .tb-refresh', this.editorPanel).on('click', function (e) {
        e.preventDefault();
        this$1.editorFrame.get(0).contentWindow.location.reload(true);
    });

    $("#tabs").tabs({
        activate: function (event, ui) {
            this$1.savePanelState();
        },
        create: function (event, ui) {
            this$1.restorePanelState();
        }
    });

    $(".tabs").tabs({});


    /**
     *  Open new page dialog
     */
    $('#tab-pages', this.editorPanel).on('click', '.btn-create', function (e) {
        e.preventDefault();
        this$1.addPage();
    });

    /**
     *  Load page in window
     */
    $('#tab-pages', this.editorPanel).on('click', '.load', function (e) {
        e.preventDefault();
        var src = $(e.target).data('url');
        window.top.location.href = src;
    });

    /**
     *  Open edit page dialog
     */
    $('#tab-pages', this.editorPanel).on('click', '.settings', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        this$1.page_id = parent.data('id');
        this$1.editPage();
    });

    /**
     *  Duplicate a page
     */
    $('#tab-pages', this.editorPanel).on('click', '.duplicate', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        var page_id = parent.data('id');
        this$1.showLoadingIndicator();
        $.ajax({
            type: 'POST',
            url: '/admin/page/duplicate',
            data: 'id=' + page_id,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done(function (data) {
            this$1.data = data;
            this$1.loadPageURL();
        });
    });

    /**
     *  Delete a page
     */
    $('#tab-pages', this.editorPanel).on('click', '.delete', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        var page_id = parent.data('id');

        var message = 'Are you sure you want to delete page?';

        this$1.showConfirmationDialog(message, function () {
            this$1.showLoadingIndicator();
            $.ajax({
                type: 'POST',
                url: '/admin/page/' + page_id,
                data: {
                    '_method': 'delete'
                },
                dataType: 'json',
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done(function () {
                parent.slideUp(function () {
                    parent.remove();
                    this$1.hideLoadingIndicator();
                });
            });
        });
    });

    /**
     *  Open new menu dialog
     */
    $('#tab-menus', this.editorPanel).on('click', '.btn-create', function (e) {
        e.preventDefault();
        //let menu_type_id = $('#menuSelector').find('option:selected').val();
        this$1.addMenu(this$1.getMenuID());
    });

    /**
     *  Load menu in window
     */
    $('#tab-menus', this.editorPanel).on('click', '.load', function (e) {
        e.preventDefault();
        var src = $(e.target).data('url');
        var target = $(e.target).data('target');
        if (target == '') {
            window.top.location.href = src;
        } else {
            window.open(src);
        }
    });


    /**
     *  Open edit menu dialog
     */
    $('#tab-menus', this.editorPanel).on('click', '.edit', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        this$1.menu_type_id = parent.data('id');
        this$1.editMenu();
    });


    /**
     *  Toggle menu active state
     */
    $('#tab-menus', this.editorPanel).on('click', '.toggleActive', function (e) {
        e.preventDefault();
        this$1.showLoadingIndicator();
        var menu_type_id = $(e.target).parents('.dd-item').data('id');
        var active = $(e.target).data('active');
        $.ajax({
            type: 'POST',
            url: '/admin/menu/active',
            data: 'id=' + menu_type_id + '&active=' + active,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done(function () {
            $(e.target).toggleClass("fa-circle-o").toggleClass("fa-circle");
            this$1.hideLoadingIndicator();
        });
    });


    /**
     *  Delete a menu
     */
    $('#tab-menus', this.editorPanel).on('click', '.delete', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        var menu_type_id = parent.data('id');

        var message = 'Are you sure you want to delete menu item?';

        this$1.showConfirmationDialog(message, function () {
            this$1.showLoadingIndicator();
            $.ajax({
                type: 'POST',
                url: '/admin/menu/' + menu_type_id,
                data: {
                    '_method': 'delete'
                },
                dataType: 'json',
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done(function () {
                parent.slideUp(function () {
                    parent.remove();
                    this$1.hideLoadingIndicator();
                });
            });
        });
    });

    /**
     *  Select a menu
     */
    $('#menuSelector', this.editorPanel).on('change', function (e) {
        //let menu_type_id = $('#menuSelector').find('option:selected').val();
        this$1.loadMenu(this$1.getMenuID());
    });

    /**
     *  Menu item type form select
     */
    $('body').on('change', '#menuTypeSelector', function (e) {
        this$1.renderMenuTypeSelect();
    });


    /**
     *  Open edit collection dialog
     */
    $('#tab-collections', this.editorPanel).on('click', '.openCollection', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        this$1.collection = parent.data('collection');
        this$1.editCollection(this$1.collection);
    });

    /**
     *  Tab collections tab1
     *  Load collection in iframe
     */

    $('body').on('click', '#collection-tab1 .btn-create', function (e) {
        e.preventDefault();
        this$1.addCollectionItem();
    });

    /**
     *  Tab collections tab1
     *  Load collection in iframe
     */
    $('body').on('click', '#collectionItems .load', function (e) {
        e.preventDefault();
        var src = $(e.target).data('url');
        //this.editorFrame = src;
        // this.editorFrame.attr('src',src);
        window.top.location.href = src;
    });

    $('body').on('click', '#collectionItems .edit', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        this$1.collection_id = parent.data('id');
        this$1.editCollectionItem();
    });

    $('body').on('click', '#collectionItems .delete', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        this$1.collection_id = parent.data('id');

        var message = 'Are you sure you want to delete this item?';

        this$1.showConfirmationDialog(message, function () {
            this$1.showLoadingIndicator();
            $.ajax({
                type: 'POST',
                url: '/admin/blog/' + this$1.collection_id,
                data: {
                    '_method': 'delete'
                },
                dataType: 'json',
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done(function () {
                this$1.loadCollectionItems();
                $('#collection-tab1-left').html('');
                // parent.slideUp(() => {
                // parent.remove();
                // this.hideLoadingIndicator();
                // });
            });
        });
    });

    $('body').on('click', 'button.submit', function (e) {
        e.preventDefault();
        var form = $(e.target).parents('form');
        this$1.submitCollectionForm(form);
    });

    // collection pagination
    $('body').on('click', '#collection-edit .pagination a', function (e) {
        e.preventDefault();
        this$1.showLoadingIndicator();
        var href = $(e.target).attr('href');
        $.ajax({
            type: 'GET',
            url: href,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done(function (html) {
            $('#collectionItemsOuter').html(html);
            this$1.hideLoadingIndicator();
        });
    });

    /**
     *  Open edit page dialog
     */
    $('#tab-settings', this.editorPanel).on('click', '.openSettings', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        this$1.setting = parent.data('setting');
        this$1.editSetting(this$1.setting);
    });

    /**
     *  Tab settings logs
     *  Load collection in iframe
     */
    $('#tab-settings', this.editorPanel).on('click', '.openLogs', function (e) {
        e.preventDefault();
        var parent = $(e.target).parents('.dd-item');
        this$1.setting = parent.data('setting');
        //console.log(this.setting)
        this$1.editSetting(this$1.setting);
    });

};


/**
 *  Editor edit collection window
 */
Editor.prototype.editCollection = function editCollection () {
        var this$1 = this;

    this.openDialog({
        id: 'collection-edit',
        title: 'Edit',
        modal: true,
        width: 800,
        minHeight: 600,
        url: '/admin/' + this.collection + '/collectionIndex',
        type: 'ajax',
        onAfterShow: function () {
            this$1.loadCollectionItems();
        },
        // callback: () => {
        // // //this.loadPages();
        // // // alert('yo');
        // //this.loadCollectionItems(collection);
        // },
        buttons: {
            // ok: 'Save',
            // Cancel: () => {
            //     this.dialog.dialog("close");
            // }
        }
    });
};

/**
 *  Editor load all collection items
 */
Editor.prototype.loadCollectionItems = function loadCollectionItems () {
        var this$1 = this;

    this.showLoadingIndicator();
    $.ajax({
        type: 'GET',
        url: '/admin/' + this.collection + '/listCollectionItems',
        //data: 'id='+menu_type_id,
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    }).done(function (html) {
        $('#collectionItemsOuter').html(html);
        this$1.hideLoadingIndicator();
    });
};

/**
 *  Editor add collection item
 */
Editor.prototype.addCollectionItem = function addCollectionItem () {
        var this$1 = this;

    this.showLoadingIndicator();
    $.ajax({
        type: 'GET',
        url: '/' + this.editorLocale + '/admin/' + this.collection + '/create',
        //data: 'id='+menu_type_id,
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    }).done(function (html) {
        $('#collection-tab1-left').html(html);
        $('#collection-tab1-left .tabs').tabs();
        this$1.hideLoadingIndicator();
    });
};

/**
 *  Editor edit collection window
 */
Editor.prototype.editCollectionItem = function editCollectionItem () {
        var this$1 = this;

    this.showLoadingIndicator();
    $.ajax({
        type: 'GET',
        url: '/' + this.editorLocale + '/admin/' + this.collection + '/' + this.collection_id + '/settings',
        //data: 'id='+menu_type_id,
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    }).done(function (html) {
        $('#collection-tab1-left').html(html);
        $('#collection-tab1-left .tabs').tabs();
        this$1.hideLoadingIndicator();
    });
};

Editor.prototype.submitCollectionForm = function submitCollectionForm (form) {
        var this$1 = this;

    // if (options.type == 'ajax') {
    this.showLoadingIndicator();
    //let form = $('#collection-edit form:visible');
    var formData = form.serialize();
    var action = form.attr('action');
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: action, // the url where we want to POST
        data: formData, // our data object
        dataType: 'json', // what type of data do we expect back from the server
        encode: true,
        error: function (data) {
            this$1.hideLoadingIndicator();
            $("input").parent().removeClass('has-error');
            $("input").prev().find('span').remove();
            var errors = data.responseJSON;
            console.log(errors);
            $.each(errors, function (key, value) {
                $("input[name=" + key + "]").parent().addClass('has-error');
                $("input[name=" + key + "]").prev().append(' <span class="has-error">' + value + '</span>');
            });
        }
    }).done(function (data) {
        //this.hideLoadingIndicator();
        //console.log(data)
        if (data == true) {
            this$1.hideLoadingIndicator();
        } else {
            this$1.collection_id = data.id;
            this$1.loadCollectionItems(this$1.collection);
            this$1.editCollectionItem();
        }

        //this.data = data;
        //dialog.dialog('close');
        //dialog.remove();
        // if (typeof(options.callback) === 'function') {
        // options.callback();
        // }

    });
    // } else {
    // form.submit()
    // }
};

/**
 *  Editor edit page window
 */
Editor.prototype.editSetting = function editSetting (setting) {
    this.openDialog({
        id: 'setting-edit',
        title: 'Edit',
        modal: false,
        width: 800,
        url: '/admin/' + setting,
        type: 'ajax',
        // callback: () => {
        // this.loadPages();
        // },
        buttons: {
            // ok: 'Save',
            // Cancel: () => {
            //     this.dialog.dialog("close");
            // }
        }
    });
};

/**
 * Menu Popup create edit
 * Render selection
 */
Editor.prototype.renderMenuTypeSelect = function renderMenuTypeSelect () {
    var dropdown = $('#menuTypeItemSelector');
    if (dropdown.length) {
        var external = $('#menuTypeExternalInput');
        var selected = $('#menuTypeSelector').find('option:selected').val();
        if (selected == 'External') {
            dropdown.hide();
            external.show();
        } else {
            dropdown.show();
            external.hide();
            $('#external_link').val('');
            $.ajax({
                type: 'GET',
                url: '/admin/menuSelectorType/' + selected,
                //data: 'id='+menu_type_id,
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done(function (data) {
                dropdown.empty();
                //ele.append('<option value="0">-- Auswahl --</option>');
                var selected = 0;
                if ($('#morpher_id_orig').length) {
                    selected = $('#morpher_id_orig').text();
                }
                for (var i = 0; i < data.length; i++) {
                    var sel = '';
                    if (data[i].id == selected) {
                        sel = ' selected="selected"';
                    }
                    dropdown.append('<option value="' + data[i].id + '"' + sel + '>' + data[i].title + '</option>');
                }
            });
        }
    }
};

/**
 *  Editor load all pages
 */
Editor.prototype.loadPages = function loadPages () {
        var this$1 = this;

    this.showLoadingIndicator();
    $.ajax({
        type: 'GET',
        url: '/admin/page/listPages/' + this.editorLocale,
        //data: 'id='+menu_type_id,
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    }).done(function (html) {
        $('#pageItems').html(html);
        this$1.hideLoadingIndicator();
    });
};

/**
 *  Editor edit page window
 */
Editor.prototype.editPage = function editPage () {
        var this$1 = this;

    this.openDialog({
        id: 'page-edit',
        title: 'Edit',
        modal: true,
        url: '/' + this.editorLocale + '/admin/page/' + this.page_id + '/settings',
        type: 'ajax',
        callback: function () {
            this$1.loadPages();
        },
        buttons: {
            ok: 'Save',
            Cancel: function () {
                this$1.dialog.dialog("close");
            }
        }
    });
};


/**
 * Editor add page window
 */
Editor.prototype.addPage = function addPage () {
        var this$1 = this;

    this.openDialog({
        id: 'page-add',
        title: 'Create a new Page',
        modal: true,
        url: '/admin/page/create',
        type: 'ajax',
        buttons: {
            ok: 'Create',
            Cancel: function () {
                this$1.dialog.dialog("close");
            }
        },
        callback: function () {
            this$1.loadPageURL();
        },
    });
};

Editor.prototype.loadPageURL = function loadPageURL () {
    window.top.location.href = '/page/' + this.data.slug;
};


/**
 * save Editor State
 */
Editor.prototype.savePanelState = function savePanelState () {
    var activeLanguage = this.editorLocale;
    var activeTab = $('#tabs').tabs("option", "active");
    var activeMenu = $('#menuSelector', this.editorPanel).val();
    localStorage.setItem("editor-panel", JSON.stringify({
        pinned: this.editorPanel.hasClass('pinned'),
        position: this.editorPanel.position(),
        locale: activeLanguage,
        tab: activeTab,
        menu: activeMenu,
        expanded: $('#modal-toggle:visible', this.editorPanel).length
    }));
};


/**
 * restore Editor State
 */
Editor.prototype.restorePanelState = function restorePanelState () {
    this.editorPanel.fadeIn();
    var panelState = {};
    if (!localStorage.getItem("editor-panel")) {
        panelState = {
            pinned: true,
            position: { left: 50, top: 150 },
            locale: this.editorLocale,
            tab: 0,
            menu: 1,
            expanded: true
        };
    } else {
        panelState = JSON.parse(localStorage.getItem("editor-panel"));
    }
    if (!panelState.pinned) {
        this.editorPinned = false;
        this.editorFrame.animate({ 
            width: '100%'
        }, 500);
        this.editorPanel.css('right','auto').css(panelState.position).draggable( 'enable' );
        if (!panelState.expanded) {
            this.editorPanelCollapse.hide();
            $('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
        }
    } else {
        // this.editorFrame.addClass('pinned');
        this.editorPinned = true;
        this.editorFrame.animate({ 
            width: $(document).width()-340 
        }, 500);
        // var left = this.editorPanel.position().left; // get left position
        // var width = this.editorPanel.width(); // get width;
        // var right = width + left;
        this.editorPanel.addClass('pinned');
        this.editorPanel.css('right', 0).css('left','auto').css('top', 0).draggable( 'disable' );
                        // .animate({
                        // right: 0,
                        // top: 0
                        // }, 500);
                        //.css('right', 0).css('left','auto').css('top', 0);
        if (!panelState.expanded) {
            this.editorPanelCollapse.show();
                
        }
    }
    this.editorLocale = panelState.locale;
    $("#editorLocales > [value=" + panelState.locale + "]").attr("selected", "true");
    $('#tabs').tabs("option", "active", panelState.tab);
    $("#menuSelector > [value=" + panelState.menu + "]").attr("selected", "true");
    this.loadPages();
    this.loadMenu(panelState.menu);
};


/**
 *  Get active Menu id
 */
Editor.prototype.getMenuID = function getMenuID () {
    return $('#menuSelector').find('option:selected').val();
};

/**
 *  Editor load selected menu
 */
Editor.prototype.loadMenu = function loadMenu (menu_type_id) {
        var this$1 = this;

    this.showLoadingIndicator();
    $.ajax({
        type: 'GET',
        url: '/admin/menu/listMenus/' + menu_type_id + '/' + this.editorLocale,
        //data: 'id='+menu_type_id,
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    }).done(function (html) {
        $('#menuItems').html(html);
        this$1.initNestableMenu($('#menuItemsList'));
        this$1.savePanelState();
        this$1.hideLoadingIndicator();
    });
};

Editor.prototype.initNestableMenu = function initNestableMenu (ele) {
        var this$1 = this;

    ele.nestable({
        maxDepth: 2
    }).on('change', function () {
        this$1.showLoadingIndicator();
        $.ajax({
            type: 'POST',
            url: '/admin/menu/sortorder',
            data: JSON.stringify(ele.nestable('asNestedSet')),
            contentType: "json",
            /*headers: {
                'X-CSRF-Token': $('meta[name="_token"]').attr('content')
            },*/
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done(function () {
            this$1.hideLoadingIndicator();
        });
    });
};


/**
 *  Editor edit menu window
 */
Editor.prototype.editMenu = function editMenu () {
        var this$1 = this;


    this.openDialog({
        id: 'menu-edit',
        title: 'Edit',
        modal: true,
        url: '/admin/menu/' + this.menu_type_id + '/settings' + '/' + this.editorLocale,
        type: 'ajax',
        onAfterShow: function () {
            this$1.renderMenuTypeSelect();
        },
        callback: function () {
            this$1.loadMenu(this$1.getMenuID());
        },
        cache: false,
        buttons: {
            ok: 'Save',
            Cancel: function () {
                this$1.dialog.dialog("close");
            }
        }
    });
};


/**
 *  Editor new menu window
 */
Editor.prototype.addMenu = function addMenu (menu_type_id) {
        var this$1 = this;


    this.openDialog({
        id: 'menu-add',
        title: 'Create a new menu',
        modal: true,
        url: '/' + this.editorLocale + '/admin/menu/create/' + menu_type_id,
        type: 'ajax',
        onAfterShow: function () {
            this$1.renderMenuTypeSelect();
        },
        callback: function () {
            this$1.loadMenu(menu_type_id);
        },
        buttons: {
            ok: 'Create',
            Cancel: function () {
                this$1.dialog.dialog("close");
            }
        }
    });
};


/**
 * Global Modal open window
 */
Editor.prototype.openDialog = function openDialog (options) {
        var this$1 = this;


    var formDom = $('<div></div>').attr('id', options.id);
    $.ajax({
            url: options.url,
        })
        .done(function (html) {
            formDom.hide().append(html);
            if (formDom.find('.tabs').length === 1) {
                $('.tabs', formDom).tabs({
                    /*activate: function(){
                        if (typeof(options.onTabChange) === 'function'){
                            options.onTabChange(formDom);
                        }
                    }*/
                });
            }

            if (typeof(options.onCreate) === 'function') {
                options.onCreate(formDom);
            }

            $('body').append(formDom);
            this$1.showDialog(options);
        });
};



Editor.prototype.showDialog = function showDialog (options) {
        var this$1 = this;

    var dialog = $('#' + options.id);
    var form = $('form', dialog);

    if (form.find('.tabs').length === 1) {
        $('.tabs ul li a', form).eq(0).click();
    }

    // options += {
    //   "email_type": "default",
    //   "email": "",
    //   "subject": "",
    //   "thanks_msg": "",
    //   "submit": "fsdfsfd",
    //   "style": "s-horizontal",
    //   "fields": [
    // {
    //   "type": "text",
    //   "title": "Test",
    //   "isMandatory": false
    // }
    //   ]};


    var buttons = {};

    if (typeof(options.buttons.ok) !== 'undefined') {
        buttons[options.buttons.ok] = function () {
            this$1.submitForm(dialog, form, options);
        };
    }
    // buttons['Close'] = () => {
    // dialog.dialog('close');
    // dialog.remove();
    // };
    // 
    if (typeof(options.onShow) === 'function') {
        options.onShow(form, options.values);
    }

    dialog.dialog({
        title: options.title,
        modal: options.modal,
        buttons: buttons,
        width: typeof(options.width) === 'undefined' ? 450 : options.width,
        minWidth: 300,
        //minHeight: 600,
        minHeight: typeof(options.minHeight) === 'undefined' ? 'auto' : options.minHeight,
        position: {
            my: "center top",
            at: "center top+80",
            of: window
        },
        open: function() {

            //$(this).closest('.ui-dialog').find(".ui-dialog-buttonset .ui-button:first").addClass("green");

            if (typeof(options.onAfterShow) === 'function') {
                options.onAfterShow();
            }

        },
        close: function(event, ui) {
            dialog.remove();
        }
    });
};

Editor.prototype.submitForm = function submitForm (dialog, form, options) {
        var this$1 = this;

    if (typeof(options.onSubmit) === 'function') {
        //console.log(options)
        options.onSubmit(options, form);
        dialog.dialog('close');
    } else if (options.type == 'ajax') {
        var formData = form.serialize();
        var action = form.attr('action');
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: action, // the url where we want to POST
            data: formData, // our data object
            dataType: 'json', // what type of data do we expect back from the server
            encode: true,
            error: function (data) {
                $("input").parent().removeClass('has-error');
                $("input").prev().find('span').remove();
                var errors = data.responseJSON;
                console.log(errors);
                $.each(errors, function (key, value) {
                    $("input[name=" + key + "]").parent().addClass('has-error');
                    $("input[name=" + key + "]").prev().append(' <span class="has-error">' + value + '</span>');
                });
            }
        }).done(function (data) {
            this$1.data = data;
            dialog.dialog('close');
            //dialog.remove();
            if (typeof(options.callback) === 'function') {
                options.callback();
            }

        });
    } else {
        form.submit();
    }
};

Editor.prototype.showMessageDialog = function showMessageDialog (message, title) {

    var messageHtml = message;

    if (typeof(message) === 'object'){
        messageHtml = $('<ul></ul>').addClass('messages-list');
        for (var i in message){
            var itemDom = $('<li></li>').html(message[i]);
            messageHtml.append(itemDom);
        }
    }

    var buttons = {};

    buttons["ok"] = function(){
        $(this).dialog('close');
    };

    $('<div class="message-text inlinecms"></div>').append(messageHtml).dialog({
        title: title,
        modal: true,
        resizable: false,
        width: 350,
        buttons: buttons
    });

};

Editor.prototype.showPromptDialog = function showPromptDialog (message, title, onSubmit, defaultValue) {

    var form = $('<div/>').addClass('message-prompt inlinecms');
    var prompt = $('<div/>').addClass('prompt').html(message);
    var input = $('<input/>').attr('type', 'text').val(defaultValue);

    var buttons = {};

    buttons['ok'] = function(){
        onSubmit(input.val());
        $(this).dialog('close');
    };

    buttons['cancel'] = function(){
        $(this).dialog('close');
    };

    form.append(prompt).append(input).dialog({
        title: title,
        modal: true,
        resizable: false,
        width: 350,
        buttons: buttons,
        open: function(){
            setTimeout(function(){
                input.focus();
            }, 10);
        }
    });
};

Editor.prototype.showConfirmationDialog = function showConfirmationDialog (message, onConfirm, onCancel) {

    var buttons = {};

    buttons["yes"] = function() {
        if (typeof(onConfirm) === 'function') { onConfirm(); }
        $(this).dialog('close');
    };

    buttons["no"] = function() {
        if (typeof(onCancel) === 'function') { onCancel(); }
        $(this).dialog('close');
    };

    $('<div class="message-text jodelcms"></div>').append(message).dialog({
        title: "confirmation",
        modal: true,
        resizable: false,
        width: 350,
        buttons: buttons,
        open: function() {
            $(this).closest('.ui-dialog').find(".ui-dialog-buttonset .ui-button:first").addClass("green");
            $(this).closest('.ui-dialog').find(".ui-dialog-buttonset .ui-button:last").addClass("red");
        }
    });

};

// getElementOptions(elementId){

// // alert(JSON.stringify(this.editorFrame.get(0).contentWindow.options));
// console.log(elementId)
// return '{"size": "60" }';
// $.ajax({
//         type: 'GET', // define the type of HTTP verb we want to use (POST for our form)
//         url: '/admin/element/'+elementId, // the url where we want to POST
//         dataType: 'json', // what type of data do we expect back from the server
//         encode: true,
//         error: (data) => {

//             }
//     }).done((data) => {
//         return '{"size": 60 }';
//     });

// // var widget = this.getWidget(regionId, widgetId);
// // return widget.options;
// //return '{"size":"60"}';
// //
// // return {"email_type": "default",
// //   "email": "",
// //   "subject": "",
// //   "thanks_msg": "",
// //   "submit": "fsdfsfd",
// //   "style": "s-horizontal",
// //   "fields": [
// // {
// //   "type": "text",
// //   "title": "Test",
// //   "isMandatory": false
// // }
// //   ]};

// };

/**
 * Registers all Elements
 */
Editor.prototype.registerElementHandler = function registerElementHandler (id, handler) {

    handler.getTitle = function() {
        //return cms.lang("widgetTitle_" + this.getName());
        //return 'TextBlock';
        return this.getName();
    };

    this.elementHandlers[id] = handler;

};


/**
 * Build the Editor list of Elements
 */
Editor.prototype.buildElementsList = function buildElementsList () {
        var this$1 = this;


    var elementsList = $('#tab-elements .list ul', this.editorPanel);

    for (var i in this.elementsList) {
        var elementId = this$1.elementsList[i];

        var title = this$1.elementHandlers[elementId].getTitle();
        var icon = this$1.elementHandlers[elementId].getIcon();

        var item = $('<li></li>').attr('data-id', elementId).addClass('editor-element');
        item.html('<i class="fa ' + icon + '"></i>');
        item.attr('title', title);
        item.tooltip({
            track: true,
            show: false,
            hide: false
        });
        elementsList.append(item);
    }

    $('li', elementsList).draggable({
        helper: "clone",
        iframeFix: true
    });
};

/**
 * Initialize the editable Elements
 */
Editor.prototype.initElements = function initElements (region) {
        var this$1 = this;

    region.find('>div').each(function (i, elm) {

        var elementDom = $(elm);

        var type = elementDom.data('type');
        var handler = this$1.elementHandlers[type];

        handler.initElement(elementDom, function (elementDom, type) {
            this$1.buildElementToolbar(elementDom, handler);
        });
    });
};

/**
 * Build elements Toolbar
 */
Editor.prototype.buildElementToolbar = function buildElementToolbar (elementDom, handler) {
        var this$1 = this;


    if (typeof(handler.toolbarButtons) === 'undefined') {

        var defaultToolbarButtons = {
            "options": {
                icon: "fa-wrench",
                title: 'Options'
            },
            "move": {
                icon: "fa-arrows",
                title: 'Move',
                click: function (elementDom) {
                    return false;
                }
            },
            "delete": {
                icon: "fa-trash",
                title: 'Delete',
                click: function (elementDom) {
                    this$1.deleteElement(elementDom);
                }
            }
        };

        var buttons = {};

        if (typeof(handler.getToolbarButtons) === 'function') {
            buttons = handler.getToolbarButtons();
        }

        handler.toolbarButtons = $.extend(true, {}, defaultToolbarButtons, buttons);

    }

    var toolbar = $('<div />').addClass('inline-toolbar').addClass('jodelcms');
    var isFixedRegion = elementDom.parents('.jodelcms-region-fixed').length > 0;

    $.map(handler.toolbarButtons, function(button, buttonId) {

        if (button === false) {
            return button; }
        if (buttonId == 'move' && isFixedRegion) {
            return button; }
        if (buttonId == 'delete' && isFixedRegion) {
            return button; }

        var buttonDom = $('<div></div>').addClass('button').addClass('b-' + buttonId);
        buttonDom.attr('title', button.title);
        buttonDom.html('<i class="fa ' + button.icon + '"></i>');

        toolbar.append(buttonDom);

        if (typeof(button.click) === 'function') {
            buttonDom.click(function(e) {
                e.stopPropagation();
                button.click(elementDom);
            });
        }

        return button;

    });

    elementDom.append(toolbar);

};

/**
 * Initialize the editable Regions
 */
Editor.prototype.initRegions = function initRegions () {
        var this$1 = this;

    $('.jodelRegion', this.editorFrame.contents()).each(function (i, elm) {
        var region = $(elm);
        this$1.initElements(region);

        var dropZone = $('<div></div>').addClass('drop-helper').addClass('jodelcms');
        dropZone.html('<i class="fa fa-plus-circle"></i>');

        region.append(dropZone);

        $('.drop-helper', region).hide();

        if (region.hasClass('jodelcms-region-fixed')) {
            return; }

        region.droppable({
            accept: ".editor-element",
            over: function () {
                $('.drop-helper', region).show();
            },
            out: function () {
                $('.drop-helper', region).hide();
            },
            drop: function (event, ui) {
                $('.drop-helper', region).hide();
                this$1.addElement(region, ui.draggable.data('id'));
            }
        });

        region.sortable({
            handle: '.b-move',
            //axis: 'y',
            connectWith: '.jodelRegion',
            update: function (event, ui) {
                this$1.setChanges();
            }
        });
    });
};


Editor.prototype.addElement = function addElement (regionDom, type) {
        var this$1 = this;

    //alert(type)
    var regionId = regionDom.data('region-id');
    var elementOrder = regionDom.find('>div').length - 1;
    var totalElements = this.editorFrame.contents().find('div.jodelcms-element').length;
    var dummyID = Number(totalElements)+1;

    var handler = this.elementHandlers[type];
    var options = handler.defaultOptions;

    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: '/admin/element/add', // the url where we want to POST
        data: { 'id': regionId, 'dummyID': dummyID, 'type': type, 'options': JSON.stringify(options), 'order': elementOrder }, // our data object
        //dataType: 'json', // what type of data do we expect back from the server
        encode: true,
        error: function (data) {}
    }).done(function (data) {
        var elementDom = $(data);
        $('.drop-helper', regionDom).before(elementDom);

        handler.createElement(regionId, elementDom, function (elementDom, type) {
            this$1.buildElementToolbar(elementDom, handler);
            return true;
        });
        this$1.setChanges();
    });
};

/**
 * Delete an Element
 */
Editor.prototype.deleteElement = function deleteElement (elementDom) {
        var this$1 = this;


    var elementId = elementDom.attr('id');
    var eid = elementId.replace('element_', '');
    var type = elementDom.data('type');
    var handler = this.elementHandlers[type];

    this.showConfirmationDialog('Delete this Element', function () {

        if( ! elementDom.hasClass('dummy')) {
            this$1.elementsToDelete.push(eid);
        }
        if (typeof(handler.deleteElement) === 'function') {
            handler.deleteElement(elementDom);
        } else {
            elementDom.remove();
        }
        this$1.setChanges();
    });
};

// import $ from 'jquery';
// import jQuery from 'jquery';
// window.$ = $;
// window.jQuery = jQuery;

// import 'bootstrap-sass';

window.editor = new Editor();

$(function() {
    editor.initPanel();
});

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));

//# sourceMappingURL=editor.js.map
