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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9Vc2Vycy9HdW5pL1NpdGVzL2pvZGVsQ01TL3Jlc291cmNlcy9hc3NldHMvanMvZWRpdG9yL2VkaXRvci5qcyIsIi9Vc2Vycy9HdW5pL1NpdGVzL2pvZGVsQ01TL3Jlc291cmNlcy9hc3NldHMvanMvZWRpdG9yX21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5jbGFzcyBFZGl0b3Ige1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yUGFuZWwgPSAkKCcjZWRpdG9yLXBhbmVsJyk7XG4gICAgICAgIHRoaXMuZWRpdG9yUGFuZWxDb2xsYXBzZSA9ICQoJyNtb2RhbC10b2dnbGUnKTtcbiAgICAgICAgdGhpcy5wYWdlX2lkID0gMDtcbiAgICAgICAgdGhpcy5lZGl0b3JGcmFtZSA9ICQoXCIjZWRpdG9ySUZyYW1lXCIpO1xuICAgICAgICB0aGlzLmRhdGEgPSAnJztcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb25faWQgPSAwO1xuICAgICAgICB0aGlzLmVkaXRvckxvY2FsZSA9ICdlbic7XG4gICAgICAgIHRoaXMuZWRpdG9yUGlubmVkID0gdHJ1ZTtcbiAgICAgICAgLy90aGlzLmVsZW1lbnRzTGlzdCA9IFtcInRleHRcIixcImltYWdlXCIsXCJnYWxsZXJ5XCIsXCJ2aWRlb1wiLFwiZmlsZVwiLFwiZm9ybVwiLFwibWFwXCIsXCJzaGFyZVwiLFwic3BhY2VyXCIsXCJjb2RlXCJdO1xuICAgICAgICB0aGlzLmVsZW1lbnRzTGlzdCA9IFsndGV4dCcsICdzcGFjZXInLCAnZm9ybScsICdtYXAnLCAnc29jaWFsJ107XG4gICAgICAgIHRoaXMuZWxlbWVudEhhbmRsZXJzID0ge307XG4gICAgICAgIHRoaXMuZWxlbWVudE9wdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5pc0dvb2dsZU1hcHNBcGlMb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbGVtZW50c1RvRGVsZXRlID0gW107XG4gICAgICAgIHRoaXMuaGFzVW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRDaGFuZ2VzKCkge1xuICAgICAgICB0aGlzLmhhc1Vuc2F2ZWRDaGFuZ2VzID0gdHJ1ZTtcbiAgICAgICAgJCgnI3NhdmVNZScpLnNob3coKTtcbiAgICAgICAgLy8kKCcuYnRuLXNhdmUnLCB0aGlzLnBhbmVsKS5hZGRDbGFzcygnZ2xvdycpLmZpbmQoJ2knKS5yZW1vdmVDbGFzcygnZmEtY2hlY2snKS5hZGRDbGFzcygnZmEtZXhjbGFtYXRpb24tY2lyY2xlJyk7XG4gICAgfTtcblxuICAgIGhhc0NoYW5nZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc1Vuc2F2ZWRDaGFuZ2VzO1xuICAgIH07XG5cbiAgICBub0NoYW5nZXMoKSB7XG4gICAgICAgIHRoaXMuaGFzVW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcbiAgICAgICAgJCgnI3NhdmVNZScpLmhpZGUoKTtcbiAgICAgICAgLy8kKCcuYnRuLXNhdmUnLCB0aGlzLnBhbmVsKS5yZW1vdmVDbGFzcygnZ2xvdycpLmZpbmQoJ2knKS5yZW1vdmVDbGFzcygnZmEtZXhjbGFtYXRpb24tY2lyY2xlJykuYWRkQ2xhc3MoJ2ZhLWNoZWNrJyk7XG4gICAgfTtcblxuICAgIHNob3dMb2FkaW5nSW5kaWNhdG9yKCkge1xuICAgICAgICAkKCcjZWRpdG9yLWxvYWRpbmcnKS5zaG93KCk7XG4gICAgfTtcblxuICAgIGhpZGVMb2FkaW5nSW5kaWNhdG9yKCkge1xuICAgICAgICAkKCcjZWRpdG9yLWxvYWRpbmcnKS5mYWRlT3V0KCk7XG4gICAgfTtcblxuICAgIGluamVjdFNjcmlwdCh1cmwsIGNhbGxiYWNrKSB7XG5cbiAgICAgICAgbGV0IGRvYyA9IHRoaXMuZWRpdG9yRnJhbWUuZ2V0KDApLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gICAgICAgIGxldCBoZWFkID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF07XG4gICAgICAgIGxldCBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBjYWxsYmFjaztcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGNhbGxiYWNrO1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cbiAgICB9O1xuXG4gICAgaW5pdFBhbmVsKCkge1xuICAgICAgICBcbiAgICAgICAgJC5hamF4U2V0dXAoe1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdYLUNTUkYtVE9LRU4nOiAkKCdtZXRhW25hbWU9XCJjc3JmLXRva2VuXCJdJykuYXR0cignY29udGVudCcpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWRpdG9yRnJhbWUub24oJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkKCdhW3RhcmdldCE9X2JsYW5rXScsIHRoaXMuZWRpdG9yRnJhbWUuY29udGVudHMoKSkuYXR0cigndGFyZ2V0JywgJ190b3AnKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFJlZ2lvbnMoKTtcbiAgICAgICAgICAgIC8vIGFsZXJ0KEpTT04uc3RyaW5naWZ5KHRoaXMuZWRpdG9yRnJhbWUuZ2V0KDApLmNvbnRlbnRXaW5kb3cuZW9wdGlvbnMpKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vU2F2ZSBLZXlib2FyZCBzaG9ydGN1dCBpZiBlZGl0b3IgaXMgaW4gZm9jdXNcbiAgICAgICAgJChkb2N1bWVudCkua2V5ZG93bigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSAmJiBlLndoaWNoID09IDgzKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yRnJhbWUuZ2V0KDApLmNvbnRlbnRXaW5kb3cuc2F2ZUNvbnRlbnQoKTtcbiAgICAgICAgICAgICAgICAvL3RoaXMuaGFzVW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lZGl0b3JQYW5lbC5kcmFnZ2FibGUoe1xuICAgICAgICAgICAgaGFuZGxlOiBcIi5tb2RhbC1oZWFkZXJcIixcbiAgICAgICAgICAgIGlmcmFtZUZpeDogdHJ1ZSxcbiAgICAgICAgICAgIGN1cnNvcjogXCJtb3ZlXCIsXG4gICAgICAgICAgICBjb250YWlubWVudDogXCJkb2N1bWVudFwiLFxuICAgICAgICAgICAgc3RvcDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVBhbmVsU3RhdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvclBhbmVsLmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmJ1aWxkRWxlbWVudHNMaXN0KCk7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQm9vc3RyYXAgdG9vbHRpcHNcbiAgICAgICAgICovXG4gICAgICAgIC8vICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKHtcbiAgICAgICAgLy8gICAgIGFuaW1hdGlvbjogZmFsc2VcbiAgICAgICAgLy8gfSk7IFxuXG4gICAgICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgICAgICAgICBsZXQgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICAgICAgICAgbGV0IGxlZnQgPSAkKFwiI2VkaXRvci1wYW5lbFwiKS5wb3NpdGlvbigpLmxlZnQ7XG4gICAgICAgICAgICBsZXQgd2lkdGggPSAkKFwiI2VkaXRvci1wYW5lbFwiKS53aWR0aCgpO1xuICAgICAgICAgICAgbGV0IHRvcCA9ICQoXCIjZWRpdG9yLXBhbmVsXCIpLnBvc2l0aW9uKCkudG9wO1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9ICQoXCIjZWRpdG9yLXBhbmVsXCIpLmhlaWdodCgpO1xuICAgICAgICAgICAgaWYgKHdpbmRvd1dpZHRoIDwgbGVmdCArIHdpZHRoKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0xlZnQgPSBsZWZ0IC0gKChsZWZ0ICsgd2lkdGgpIC0gd2luZG93V2lkdGgpO1xuICAgICAgICAgICAgICAgIGlmIChuZXdMZWZ0IDwgMCkgeyBuZXdMZWZ0ID0gMDsgfVxuICAgICAgICAgICAgICAgICQoXCIjZWRpdG9yLXBhbmVsXCIpLmNzcyh7IGxlZnQ6IG5ld0xlZnQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod2luZG93SGVpZ2h0IDwgdG9wICsgaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1RvcCA9IHRvcCAtICgodG9wICsgaGVpZ2h0KSAtIHdpbmRvd0hlaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1RvcCA8IDApIHsgbmV3VG9wID0gMDsgfVxuICAgICAgICAgICAgICAgICQoXCIjZWRpdG9yLXBhbmVsXCIpLmNzcyh7IHRvcDogbmV3VG9wIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy5lZGl0b3JQaW5uZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvckZyYW1lLndpZHRoKCQoZG9jdW1lbnQpLndpZHRoKCktMzQwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2F2ZVBhbmVsU3RhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc0NoYW5nZXMoKSl7IHJldHVybjsgfVxuICAgICAgICAgICAgcmV0dXJuICdwYWdlT3V0Q29uZmlybSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgJCgnI3NhdmVNZScpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRvckZyYW1lLmdldCgwKS5jb250ZW50V2luZG93LnNhdmVDb250ZW50KCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgJCgnLm1vZGFsLWhlYWRlciBzZWxlY3QnLCB0aGlzLmVkaXRvclBhbmVsKS5vbignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTG9jYWxlID0gJChlLnRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRQYWdlcygpO1xuICAgICAgICAgICAgdGhpcy5sb2FkTWVudSh0aGlzLmdldE1lbnVJRCgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLm1vZGFsLWhlYWRlciAudGItY29sbGFwc2UnLCB0aGlzLmVkaXRvclBhbmVsKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5lZGl0b3JQYW5lbENvbGxhcHNlLnNsaWRlVG9nZ2xlKDI1MCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVBhbmVsU3RhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLm1vZGFsLWhlYWRlciAudGItY29sbGFwc2UgaScpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC11cCcpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC1kb3duJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5tb2RhbC1oZWFkZXIgLnRiLXRvZ2dsZScsIHRoaXMuZWRpdG9yUGFuZWwpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRvclBhbmVsLnRvZ2dsZUNsYXNzKCdwaW5uZWQnKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yRnJhbWUudG9nZ2xlQ2xhc3MoJ3Bpbm5lZCcpO1xuICAgICAgICAgICAgLy90aGlzLmVkaXRvclBhbmVsQ29sbGFwc2Uuc2xpZGVUb2dnbGUoMjUwLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlUGFuZWxTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZVBhbmVsU3RhdGUoKVxuICAgICAgICAgICAgLy99KTtcbiAgICAgICAgICAgICQoJy5tb2RhbC1oZWFkZXIgLnRiLXRvZ2dsZSBpJykudG9nZ2xlQ2xhc3MoJ2ZhLWxvY2snKS50b2dnbGVDbGFzcygnZmEtdW5sb2NrJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5tb2RhbC1oZWFkZXIgLnRiLWNvbGxhcHNlLXJpZ2h0JywgdGhpcy5lZGl0b3JQYW5lbCkub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vIHRoaXMuZWRpdG9yUGFuZWxDb2xsYXBzZS5zbGlkZVRvZ2dsZSgyNTAsICgpID0+IHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnNhdmVQYW5lbFN0YXRlKCk7XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yUGFuZWxcbiAgICAgICAgICAgIC8vIFNldCB0aGUgZWZmZWN0IHR5cGVcbiAgICAgICAgICAgIHZhciBlZmZlY3QgPSAnc2xpZGUnO1xuXG4gICAgICAgICAgICAvLyBTZXQgdGhlIG9wdGlvbnMgZm9yIHRoZSBlZmZlY3QgdHlwZSBjaG9zZW5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0geyBkaXJlY3Rpb246ICdyaWdodCcgfTtcblxuICAgICAgICAgICAgLy8gU2V0IHRoZSBkdXJhdGlvbiAoZGVmYXVsdDogNDAwIG1pbGxpc2Vjb25kcylcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IDUwMDtcblxuICAgICAgICAgICAgdGhpcy5lZGl0b3JQYW5lbC50b2dnbGUoZWZmZWN0LCBvcHRpb25zLCBkdXJhdGlvbik7XG4gICAgICAgICAgICB0aGlzLmVkaXRvckZyYW1lLmFuaW1hdGUoe1xuICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiXG4gICAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgJCgnLm1vZGFsLWhlYWRlciAudGItY29sbGFwc2UgaScpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC1yaWdodCcpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC1sZWZ0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5tb2RhbC1oZWFkZXIgLnRiLXJlZnJlc2gnLCB0aGlzLmVkaXRvclBhbmVsKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5lZGl0b3JGcmFtZS5nZXQoMCkuY29udGVudFdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoXCIjdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgIGFjdGl2YXRlOiAoZXZlbnQsIHVpKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlUGFuZWxTdGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZTogKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZVBhbmVsU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChcIi50YWJzXCIpLnRhYnMoe30pO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBPcGVuIG5ldyBwYWdlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgJCgnI3RhYi1wYWdlcycsIHRoaXMuZWRpdG9yUGFuZWwpLm9uKCdjbGljaycsICcuYnRuLWNyZWF0ZScsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmFkZFBhZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBMb2FkIHBhZ2UgaW4gd2luZG93XG4gICAgICAgICAqL1xuICAgICAgICAkKCcjdGFiLXBhZ2VzJywgdGhpcy5lZGl0b3JQYW5lbCkub24oJ2NsaWNrJywgJy5sb2FkJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBzcmMgPSAkKGUudGFyZ2V0KS5kYXRhKCd1cmwnKTtcbiAgICAgICAgICAgIHdpbmRvdy50b3AubG9jYXRpb24uaHJlZiA9IHNyYztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBPcGVuIGVkaXQgcGFnZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgICQoJyN0YWItcGFnZXMnLCB0aGlzLmVkaXRvclBhbmVsKS5vbignY2xpY2snLCAnLnNldHRpbmdzJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZGQtaXRlbScpO1xuICAgICAgICAgICAgdGhpcy5wYWdlX2lkID0gcGFyZW50LmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQYWdlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgRHVwbGljYXRlIGEgcGFnZVxuICAgICAgICAgKi9cbiAgICAgICAgJCgnI3RhYi1wYWdlcycsIHRoaXMuZWRpdG9yUGFuZWwpLm9uKCdjbGljaycsICcuZHVwbGljYXRlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZGQtaXRlbScpO1xuICAgICAgICAgICAgbGV0IHBhZ2VfaWQgPSBwYXJlbnQuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0xvYWRpbmdJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hZG1pbi9wYWdlL2R1cGxpY2F0ZScsXG4gICAgICAgICAgICAgICAgZGF0YTogJ2lkPScgKyBwYWdlX2lkLFxuICAgICAgICAgICAgICAgIGVycm9yOiAoeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coeGhyLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRocm93bkVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5kb25lKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRQYWdlVVJMKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBEZWxldGUgYSBwYWdlXG4gICAgICAgICAqL1xuICAgICAgICAkKCcjdGFiLXBhZ2VzJywgdGhpcy5lZGl0b3JQYW5lbCkub24oJ2NsaWNrJywgJy5kZWxldGUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5kZC1pdGVtJyk7XG4gICAgICAgICAgICBsZXQgcGFnZV9pZCA9IHBhcmVudC5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgICBsZXQgbWVzc2FnZSA9ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHBhZ2U/JztcblxuICAgICAgICAgICAgdGhpcy5zaG93Q29uZmlybWF0aW9uRGlhbG9nKG1lc3NhZ2UsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYWRtaW4vcGFnZS8nICsgcGFnZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ19tZXRob2QnOiAnZGVsZXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRocm93bkVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuc2xpZGVVcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgT3BlbiBuZXcgbWVudSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgICQoJyN0YWItbWVudXMnLCB0aGlzLmVkaXRvclBhbmVsKS5vbignY2xpY2snLCAnLmJ0bi1jcmVhdGUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy9sZXQgbWVudV90eXBlX2lkID0gJCgnI21lbnVTZWxlY3RvcicpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgICAgICAgdGhpcy5hZGRNZW51KHRoaXMuZ2V0TWVudUlEKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogIExvYWQgbWVudSBpbiB3aW5kb3dcbiAgICAgICAgICovXG4gICAgICAgICQoJyN0YWItbWVudXMnLCB0aGlzLmVkaXRvclBhbmVsKS5vbignY2xpY2snLCAnLmxvYWQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IHNyYyA9ICQoZS50YXJnZXQpLmRhdGEoJ3VybCcpO1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9ICQoZS50YXJnZXQpLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICAgICAgaWYgKHRhcmdldCA9PSAnJykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy50b3AubG9jYXRpb24uaHJlZiA9IHNyYztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oc3JjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogIE9wZW4gZWRpdCBtZW51IGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgJCgnI3RhYi1tZW51cycsIHRoaXMuZWRpdG9yUGFuZWwpLm9uKCdjbGljaycsICcuZWRpdCcsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmRkLWl0ZW0nKTtcbiAgICAgICAgICAgIHRoaXMubWVudV90eXBlX2lkID0gcGFyZW50LmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICB0aGlzLmVkaXRNZW51KCk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBUb2dnbGUgbWVudSBhY3RpdmUgc3RhdGVcbiAgICAgICAgICovXG4gICAgICAgICQoJyN0YWItbWVudXMnLCB0aGlzLmVkaXRvclBhbmVsKS5vbignY2xpY2snLCAnLnRvZ2dsZUFjdGl2ZScsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnNob3dMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICBsZXQgbWVudV90eXBlX2lkID0gJChlLnRhcmdldCkucGFyZW50cygnLmRkLWl0ZW0nKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgbGV0IGFjdGl2ZSA9ICQoZS50YXJnZXQpLmRhdGEoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FkbWluL21lbnUvYWN0aXZlJyxcbiAgICAgICAgICAgICAgICBkYXRhOiAnaWQ9JyArIG1lbnVfdHlwZV9pZCArICcmYWN0aXZlPScgKyBhY3RpdmUsXG4gICAgICAgICAgICAgICAgZXJyb3I6ICh4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKFwiZmEtY2lyY2xlLW9cIikudG9nZ2xlQ2xhc3MoXCJmYS1jaXJjbGVcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBEZWxldGUgYSBtZW51XG4gICAgICAgICAqL1xuICAgICAgICAkKCcjdGFiLW1lbnVzJywgdGhpcy5lZGl0b3JQYW5lbCkub24oJ2NsaWNrJywgJy5kZWxldGUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5kZC1pdGVtJyk7XG4gICAgICAgICAgICBsZXQgbWVudV90eXBlX2lkID0gcGFyZW50LmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICAgIGxldCBtZXNzYWdlID0gJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgbWVudSBpdGVtPyc7XG5cbiAgICAgICAgICAgIHRoaXMuc2hvd0NvbmZpcm1hdGlvbkRpYWxvZyhtZXNzYWdlLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FkbWluL21lbnUvJyArIG1lbnVfdHlwZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ19tZXRob2QnOiAnZGVsZXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRocm93bkVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuc2xpZGVVcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgU2VsZWN0IGEgbWVudVxuICAgICAgICAgKi9cbiAgICAgICAgJCgnI21lbnVTZWxlY3RvcicsIHRoaXMuZWRpdG9yUGFuZWwpLm9uKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICAgICAgLy9sZXQgbWVudV90eXBlX2lkID0gJCgnI21lbnVTZWxlY3RvcicpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgICAgICAgdGhpcy5sb2FkTWVudSh0aGlzLmdldE1lbnVJRCgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBNZW51IGl0ZW0gdHlwZSBmb3JtIHNlbGVjdFxuICAgICAgICAgKi9cbiAgICAgICAgJCgnYm9keScpLm9uKCdjaGFuZ2UnLCAnI21lbnVUeXBlU2VsZWN0b3InLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJNZW51VHlwZVNlbGVjdCgpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgT3BlbiBlZGl0IGNvbGxlY3Rpb24gZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICAkKCcjdGFiLWNvbGxlY3Rpb25zJywgdGhpcy5lZGl0b3JQYW5lbCkub24oJ2NsaWNrJywgJy5vcGVuQ29sbGVjdGlvbicsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmRkLWl0ZW0nKTtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IHBhcmVudC5kYXRhKCdjb2xsZWN0aW9uJyk7XG4gICAgICAgICAgICB0aGlzLmVkaXRDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgVGFiIGNvbGxlY3Rpb25zIHRhYjFcbiAgICAgICAgICogIExvYWQgY29sbGVjdGlvbiBpbiBpZnJhbWVcbiAgICAgICAgICovXG5cbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcjY29sbGVjdGlvbi10YWIxIC5idG4tY3JlYXRlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ29sbGVjdGlvbkl0ZW0oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBUYWIgY29sbGVjdGlvbnMgdGFiMVxuICAgICAgICAgKiAgTG9hZCBjb2xsZWN0aW9uIGluIGlmcmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcjY29sbGVjdGlvbkl0ZW1zIC5sb2FkJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBzcmMgPSAkKGUudGFyZ2V0KS5kYXRhKCd1cmwnKTtcbiAgICAgICAgICAgIC8vdGhpcy5lZGl0b3JGcmFtZSA9IHNyYztcbiAgICAgICAgICAgIC8vIHRoaXMuZWRpdG9yRnJhbWUuYXR0cignc3JjJyxzcmMpO1xuICAgICAgICAgICAgd2luZG93LnRvcC5sb2NhdGlvbi5ocmVmID0gc3JjO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNjb2xsZWN0aW9uSXRlbXMgLmVkaXQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5kZC1pdGVtJyk7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb25faWQgPSBwYXJlbnQuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdENvbGxlY3Rpb25JdGVtKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnI2NvbGxlY3Rpb25JdGVtcyAuZGVsZXRlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZGQtaXRlbScpO1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uX2lkID0gcGFyZW50LmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICAgIGxldCBtZXNzYWdlID0gJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBpdGVtPyc7XG5cbiAgICAgICAgICAgIHRoaXMuc2hvd0NvbmZpcm1hdGlvbkRpYWxvZyhtZXNzYWdlLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FkbWluL2Jsb2cvJyArIHRoaXMuY29sbGVjdGlvbl9pZCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ19tZXRob2QnOiAnZGVsZXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRocm93bkVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb2xsZWN0aW9uSXRlbXMoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2NvbGxlY3Rpb24tdGFiMS1sZWZ0JykuaHRtbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHBhcmVudC5zbGlkZVVwKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHBhcmVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuaGlkZUxvYWRpbmdJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICdidXR0b24uc3VibWl0JywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBmb3JtID0gJChlLnRhcmdldCkucGFyZW50cygnZm9ybScpO1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRDb2xsZWN0aW9uRm9ybShmb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY29sbGVjdGlvbiBwYWdpbmF0aW9uXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnI2NvbGxlY3Rpb24tZWRpdCAucGFnaW5hdGlvbiBhJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0xvYWRpbmdJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgIGxldCBocmVmID0gJChlLnRhcmdldCkuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6IGhyZWYsXG4gICAgICAgICAgICAgICAgZXJyb3I6ICh4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmRvbmUoKGh0bWwpID0+IHtcbiAgICAgICAgICAgICAgICAkKCcjY29sbGVjdGlvbkl0ZW1zT3V0ZXInKS5odG1sKGh0bWwpXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgT3BlbiBlZGl0IHBhZ2UgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICAkKCcjdGFiLXNldHRpbmdzJywgdGhpcy5lZGl0b3JQYW5lbCkub24oJ2NsaWNrJywgJy5vcGVuU2V0dGluZ3MnLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5kZC1pdGVtJyk7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmcgPSBwYXJlbnQuZGF0YSgnc2V0dGluZycpO1xuICAgICAgICAgICAgdGhpcy5lZGl0U2V0dGluZyh0aGlzLnNldHRpbmcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogIFRhYiBzZXR0aW5ncyBsb2dzXG4gICAgICAgICAqICBMb2FkIGNvbGxlY3Rpb24gaW4gaWZyYW1lXG4gICAgICAgICAqL1xuICAgICAgICAkKCcjdGFiLXNldHRpbmdzJywgdGhpcy5lZGl0b3JQYW5lbCkub24oJ2NsaWNrJywgJy5vcGVuTG9ncycsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmRkLWl0ZW0nKTtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZyA9IHBhcmVudC5kYXRhKCdzZXR0aW5nJyk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2V0dGluZylcbiAgICAgICAgICAgIHRoaXMuZWRpdFNldHRpbmcodGhpcy5zZXR0aW5nKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqICBFZGl0b3IgZWRpdCBjb2xsZWN0aW9uIHdpbmRvd1xuICAgICAqL1xuICAgIGVkaXRDb2xsZWN0aW9uKCkge1xuICAgICAgICB0aGlzLm9wZW5EaWFsb2coe1xuICAgICAgICAgICAgaWQ6ICdjb2xsZWN0aW9uLWVkaXQnLFxuICAgICAgICAgICAgdGl0bGU6ICdFZGl0JyxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgIG1pbkhlaWdodDogNjAwLFxuICAgICAgICAgICAgdXJsOiAnL2FkbWluLycgKyB0aGlzLmNvbGxlY3Rpb24gKyAnL2NvbGxlY3Rpb25JbmRleCcsXG4gICAgICAgICAgICB0eXBlOiAnYWpheCcsXG4gICAgICAgICAgICBvbkFmdGVyU2hvdzogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbGxlY3Rpb25JdGVtcygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAvLyAvLyAgICAgLy90aGlzLmxvYWRQYWdlcygpO1xuICAgICAgICAgICAgLy8gLy8gICAgIC8vIGFsZXJ0KCd5bycpO1xuICAgICAgICAgICAgLy8gLy90aGlzLmxvYWRDb2xsZWN0aW9uSXRlbXMoY29sbGVjdGlvbik7XG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgICAgIC8vICAgICBvazogJ1NhdmUnLFxuICAgICAgICAgICAgICAgIC8vICAgICBDYW5jZWw6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuZGlhbG9nLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAgRWRpdG9yIGxvYWQgYWxsIGNvbGxlY3Rpb24gaXRlbXNcbiAgICAgKi9cbiAgICBsb2FkQ29sbGVjdGlvbkl0ZW1zKCkge1xuICAgICAgICB0aGlzLnNob3dMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hZG1pbi8nICsgdGhpcy5jb2xsZWN0aW9uICsgJy9saXN0Q29sbGVjdGlvbkl0ZW1zJyxcbiAgICAgICAgICAgIC8vZGF0YTogJ2lkPScrbWVudV90eXBlX2lkLFxuICAgICAgICAgICAgZXJyb3I6ICh4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHhoci5zdGF0dXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRocm93bkVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZG9uZSgoaHRtbCkgPT4ge1xuICAgICAgICAgICAgJCgnI2NvbGxlY3Rpb25JdGVtc091dGVyJykuaHRtbChodG1sKVxuICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgRWRpdG9yIGFkZCBjb2xsZWN0aW9uIGl0ZW1cbiAgICAgKi9cbiAgICBhZGRDb2xsZWN0aW9uSXRlbSgpIHtcbiAgICAgICAgdGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvJyArIHRoaXMuZWRpdG9yTG9jYWxlICsgJy9hZG1pbi8nICsgdGhpcy5jb2xsZWN0aW9uICsgJy9jcmVhdGUnLFxuICAgICAgICAgICAgLy9kYXRhOiAnaWQ9JyttZW51X3R5cGVfaWQsXG4gICAgICAgICAgICBlcnJvcjogKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coeGhyLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kb25lKChodG1sKSA9PiB7XG4gICAgICAgICAgICAkKCcjY29sbGVjdGlvbi10YWIxLWxlZnQnKS5odG1sKGh0bWwpXG4gICAgICAgICAgICAkKCcjY29sbGVjdGlvbi10YWIxLWxlZnQgLnRhYnMnKS50YWJzKCk7XG4gICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAgRWRpdG9yIGVkaXQgY29sbGVjdGlvbiB3aW5kb3dcbiAgICAgKi9cbiAgICBlZGl0Q29sbGVjdGlvbkl0ZW0oKSB7XG4gICAgICAgIHRoaXMuc2hvd0xvYWRpbmdJbmRpY2F0b3IoKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnLycgKyB0aGlzLmVkaXRvckxvY2FsZSArICcvYWRtaW4vJyArIHRoaXMuY29sbGVjdGlvbiArICcvJyArIHRoaXMuY29sbGVjdGlvbl9pZCArICcvc2V0dGluZ3MnLFxuICAgICAgICAgICAgLy9kYXRhOiAnaWQ9JyttZW51X3R5cGVfaWQsXG4gICAgICAgICAgICBlcnJvcjogKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coeGhyLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kb25lKChodG1sKSA9PiB7XG4gICAgICAgICAgICAkKCcjY29sbGVjdGlvbi10YWIxLWxlZnQnKS5odG1sKGh0bWwpXG4gICAgICAgICAgICAkKCcjY29sbGVjdGlvbi10YWIxLWxlZnQgLnRhYnMnKS50YWJzKCk7XG4gICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzdWJtaXRDb2xsZWN0aW9uRm9ybShmb3JtKSB7XG4gICAgICAgIC8vIGlmIChvcHRpb25zLnR5cGUgPT0gJ2FqYXgnKSB7XG4gICAgICAgIHRoaXMuc2hvd0xvYWRpbmdJbmRpY2F0b3IoKTtcbiAgICAgICAgLy9sZXQgZm9ybSA9ICQoJyNjb2xsZWN0aW9uLWVkaXQgZm9ybTp2aXNpYmxlJyk7XG4gICAgICAgIGxldCBmb3JtRGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XG4gICAgICAgIGxldCBhY3Rpb24gPSBmb3JtLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCAvLyBkZWZpbmUgdGhlIHR5cGUgb2YgSFRUUCB2ZXJiIHdlIHdhbnQgdG8gdXNlIChQT1NUIGZvciBvdXIgZm9ybSlcbiAgICAgICAgICAgIHVybDogYWN0aW9uLCAvLyB0aGUgdXJsIHdoZXJlIHdlIHdhbnQgdG8gUE9TVFxuICAgICAgICAgICAgZGF0YTogZm9ybURhdGEsIC8vIG91ciBkYXRhIG9iamVjdFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgLy8gd2hhdCB0eXBlIG9mIGRhdGEgZG8gd2UgZXhwZWN0IGJhY2sgZnJvbSB0aGUgc2VydmVyXG4gICAgICAgICAgICBlbmNvZGU6IHRydWUsXG4gICAgICAgICAgICBlcnJvcjogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgJChcImlucHV0XCIpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcbiAgICAgICAgICAgICAgICAkKFwiaW5wdXRcIikucHJldigpLmZpbmQoJ3NwYW4nKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gZGF0YS5yZXNwb25zZUpTT047XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3JzKTtcbiAgICAgICAgICAgICAgICAkLmVhY2goZXJyb3JzLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKFwiaW5wdXRbbmFtZT1cIiArIGtleSArIFwiXVwiKS5wYXJlbnQoKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJpbnB1dFtuYW1lPVwiICsga2V5ICsgXCJdXCIpLnByZXYoKS5hcHBlbmQoJyA8c3BhbiBjbGFzcz1cImhhcy1lcnJvclwiPicgKyB2YWx1ZSArICc8L3NwYW4+Jyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZG9uZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy90aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICBpZiAoZGF0YSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb25faWQgPSBkYXRhLmlkO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbGxlY3Rpb25JdGVtcyh0aGlzLmNvbGxlY3Rpb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuZWRpdENvbGxlY3Rpb25JdGVtKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIC8vZGlhbG9nLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgIC8vZGlhbG9nLnJlbW92ZSgpO1xuICAgICAgICAgICAgLy8gaWYgKHR5cGVvZihvcHRpb25zLmNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gICAgIG9wdGlvbnMuY2FsbGJhY2soKTtcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICB9KTtcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAgIGZvcm0uc3VibWl0KClcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBFZGl0b3IgZWRpdCBwYWdlIHdpbmRvd1xuICAgICAqL1xuICAgIGVkaXRTZXR0aW5nKHNldHRpbmcpIHtcbiAgICAgICAgdGhpcy5vcGVuRGlhbG9nKHtcbiAgICAgICAgICAgIGlkOiAnc2V0dGluZy1lZGl0JyxcbiAgICAgICAgICAgIHRpdGxlOiAnRWRpdCcsXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXG4gICAgICAgICAgICB3aWR0aDogODAwLFxuICAgICAgICAgICAgdXJsOiAnL2FkbWluLycgKyBzZXR0aW5nLFxuICAgICAgICAgICAgdHlwZTogJ2FqYXgnLFxuICAgICAgICAgICAgLy8gY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmxvYWRQYWdlcygpO1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgb2s6ICdTYXZlJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLmRpYWxvZy5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTWVudSBQb3B1cCBjcmVhdGUgZWRpdFxuICAgICAqIFJlbmRlciBzZWxlY3Rpb25cbiAgICAgKi9cbiAgICByZW5kZXJNZW51VHlwZVNlbGVjdCgpIHtcbiAgICAgICAgbGV0IGRyb3Bkb3duID0gJCgnI21lbnVUeXBlSXRlbVNlbGVjdG9yJyk7XG4gICAgICAgIGlmIChkcm9wZG93bi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBleHRlcm5hbCA9ICQoJyNtZW51VHlwZUV4dGVybmFsSW5wdXQnKTtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9ICQoJyNtZW51VHlwZVNlbGVjdG9yJykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQgPT0gJ0V4dGVybmFsJykge1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBleHRlcm5hbC5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLnNob3coKTtcbiAgICAgICAgICAgICAgICBleHRlcm5hbC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJCgnI2V4dGVybmFsX2xpbmsnKS52YWwoJycpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYWRtaW4vbWVudVNlbGVjdG9yVHlwZS8nICsgc2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgICAgIC8vZGF0YTogJ2lkPScrbWVudV90eXBlX2lkLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRocm93bkVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmRvbmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgLy9lbGUuYXBwZW5kKCc8b3B0aW9uIHZhbHVlPVwiMFwiPi0tIEF1c3dhaGwgLS08L29wdGlvbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJyNtb3JwaGVyX2lkX29yaWcnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gJCgnI21vcnBoZXJfaWRfb3JpZycpLnRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW2ldLmlkID09IHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsID0gJyBzZWxlY3RlZD1cInNlbGVjdGVkXCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uYXBwZW5kKCc8b3B0aW9uIHZhbHVlPVwiJyArIGRhdGFbaV0uaWQgKyAnXCInICsgc2VsICsgJz4nICsgZGF0YVtpXS50aXRsZSArICc8L29wdGlvbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIEVkaXRvciBsb2FkIGFsbCBwYWdlc1xuICAgICAqL1xuICAgIGxvYWRQYWdlcygpIHtcbiAgICAgICAgdGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW4vcGFnZS9saXN0UGFnZXMvJyArIHRoaXMuZWRpdG9yTG9jYWxlLFxuICAgICAgICAgICAgLy9kYXRhOiAnaWQ9JyttZW51X3R5cGVfaWQsXG4gICAgICAgICAgICBlcnJvcjogKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coeGhyLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kb25lKChodG1sKSA9PiB7XG4gICAgICAgICAgICAkKCcjcGFnZUl0ZW1zJykuaHRtbChodG1sKVxuICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgRWRpdG9yIGVkaXQgcGFnZSB3aW5kb3dcbiAgICAgKi9cbiAgICBlZGl0UGFnZSgpIHtcbiAgICAgICAgdGhpcy5vcGVuRGlhbG9nKHtcbiAgICAgICAgICAgIGlkOiAncGFnZS1lZGl0JyxcbiAgICAgICAgICAgIHRpdGxlOiAnRWRpdCcsXG4gICAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgIHVybDogJy8nICsgdGhpcy5lZGl0b3JMb2NhbGUgKyAnL2FkbWluL3BhZ2UvJyArIHRoaXMucGFnZV9pZCArICcvc2V0dGluZ3MnLFxuICAgICAgICAgICAgdHlwZTogJ2FqYXgnLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRQYWdlcygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICAgICBvazogJ1NhdmUnLFxuICAgICAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZy5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEVkaXRvciBhZGQgcGFnZSB3aW5kb3dcbiAgICAgKi9cbiAgICBhZGRQYWdlKCkge1xuICAgICAgICB0aGlzLm9wZW5EaWFsb2coe1xuICAgICAgICAgICAgaWQ6ICdwYWdlLWFkZCcsXG4gICAgICAgICAgICB0aXRsZTogJ0NyZWF0ZSBhIG5ldyBQYWdlJyxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgdXJsOiAnL2FkbWluL3BhZ2UvY3JlYXRlJyxcbiAgICAgICAgICAgIHR5cGU6ICdhamF4JyxcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICAgICBvazogJ0NyZWF0ZScsXG4gICAgICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZFBhZ2VVUkwoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBsb2FkUGFnZVVSTCgpIHtcbiAgICAgICAgd2luZG93LnRvcC5sb2NhdGlvbi5ocmVmID0gJy9wYWdlLycgKyB0aGlzLmRhdGEuc2x1ZztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIHNhdmUgRWRpdG9yIFN0YXRlXG4gICAgICovXG4gICAgc2F2ZVBhbmVsU3RhdGUoKSB7XG4gICAgICAgIGxldCBhY3RpdmVMYW5ndWFnZSA9IHRoaXMuZWRpdG9yTG9jYWxlO1xuICAgICAgICBsZXQgYWN0aXZlVGFiID0gJCgnI3RhYnMnKS50YWJzKFwib3B0aW9uXCIsIFwiYWN0aXZlXCIpO1xuICAgICAgICBsZXQgYWN0aXZlTWVudSA9ICQoJyNtZW51U2VsZWN0b3InLCB0aGlzLmVkaXRvclBhbmVsKS52YWwoKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJlZGl0b3ItcGFuZWxcIiwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgcGlubmVkOiB0aGlzLmVkaXRvclBhbmVsLmhhc0NsYXNzKCdwaW5uZWQnKSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLmVkaXRvclBhbmVsLnBvc2l0aW9uKCksXG4gICAgICAgICAgICBsb2NhbGU6IGFjdGl2ZUxhbmd1YWdlLFxuICAgICAgICAgICAgdGFiOiBhY3RpdmVUYWIsXG4gICAgICAgICAgICBtZW51OiBhY3RpdmVNZW51LFxuICAgICAgICAgICAgZXhwYW5kZWQ6ICQoJyNtb2RhbC10b2dnbGU6dmlzaWJsZScsIHRoaXMuZWRpdG9yUGFuZWwpLmxlbmd0aFxuICAgICAgICB9KSk7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogcmVzdG9yZSBFZGl0b3IgU3RhdGVcbiAgICAgKi9cbiAgICByZXN0b3JlUGFuZWxTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5lZGl0b3JQYW5lbC5mYWRlSW4oKTtcbiAgICAgICAgbGV0IHBhbmVsU3RhdGUgPSB7fTtcbiAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImVkaXRvci1wYW5lbFwiKSkge1xuICAgICAgICAgICAgcGFuZWxTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBwaW5uZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHsgbGVmdDogNTAsIHRvcDogMTUwIH0sXG4gICAgICAgICAgICAgICAgbG9jYWxlOiB0aGlzLmVkaXRvckxvY2FsZSxcbiAgICAgICAgICAgICAgICB0YWI6IDAsXG4gICAgICAgICAgICAgICAgbWVudTogMSxcbiAgICAgICAgICAgICAgICBleHBhbmRlZDogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhbmVsU3RhdGUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZWRpdG9yLXBhbmVsXCIpKVxuICAgICAgICB9XG4gICAgICAgIGlmICghcGFuZWxTdGF0ZS5waW5uZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yUGlubmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmVkaXRvckZyYW1lLmFuaW1hdGUoeyBcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgdGhpcy5lZGl0b3JQYW5lbC5jc3MoJ3JpZ2h0JywnYXV0bycpLmNzcyhwYW5lbFN0YXRlLnBvc2l0aW9uKS5kcmFnZ2FibGUoICdlbmFibGUnIClcbiAgICAgICAgICAgIGlmICghcGFuZWxTdGF0ZS5leHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yUGFuZWxDb2xsYXBzZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJCgnLm1vZGFsLWhlYWRlciAudGItY29sbGFwc2UgaScpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC11cCcpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC1kb3duJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzLmVkaXRvckZyYW1lLmFkZENsYXNzKCdwaW5uZWQnKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yUGlubmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yRnJhbWUuYW5pbWF0ZSh7IFxuICAgICAgICAgICAgICAgIHdpZHRoOiAkKGRvY3VtZW50KS53aWR0aCgpLTM0MCBcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAvLyB2YXIgbGVmdCA9IHRoaXMuZWRpdG9yUGFuZWwucG9zaXRpb24oKS5sZWZ0OyAvLyBnZXQgbGVmdCBwb3NpdGlvblxuICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gdGhpcy5lZGl0b3JQYW5lbC53aWR0aCgpOyAvLyBnZXQgd2lkdGg7XG4gICAgICAgICAgICAvLyB2YXIgcmlnaHQgPSB3aWR0aCArIGxlZnQ7XG4gICAgICAgICAgICB0aGlzLmVkaXRvclBhbmVsLmFkZENsYXNzKCdwaW5uZWQnKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yUGFuZWwuY3NzKCdyaWdodCcsIDApLmNzcygnbGVmdCcsJ2F1dG8nKS5jc3MoJ3RvcCcsIDApLmRyYWdnYWJsZSggJ2Rpc2FibGUnIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0b3A6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9LCA1MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLmNzcygncmlnaHQnLCAwKS5jc3MoJ2xlZnQnLCdhdXRvJykuY3NzKCd0b3AnLCAwKTtcbiAgICAgICAgICAgIGlmICghcGFuZWxTdGF0ZS5leHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yUGFuZWxDb2xsYXBzZS5zaG93KCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lZGl0b3JMb2NhbGUgPSBwYW5lbFN0YXRlLmxvY2FsZTtcbiAgICAgICAgJChcIiNlZGl0b3JMb2NhbGVzID4gW3ZhbHVlPVwiICsgcGFuZWxTdGF0ZS5sb2NhbGUgKyBcIl1cIikuYXR0cihcInNlbGVjdGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgJCgnI3RhYnMnKS50YWJzKFwib3B0aW9uXCIsIFwiYWN0aXZlXCIsIHBhbmVsU3RhdGUudGFiKTtcbiAgICAgICAgJChcIiNtZW51U2VsZWN0b3IgPiBbdmFsdWU9XCIgKyBwYW5lbFN0YXRlLm1lbnUgKyBcIl1cIikuYXR0cihcInNlbGVjdGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgdGhpcy5sb2FkUGFnZXMoKTtcbiAgICAgICAgdGhpcy5sb2FkTWVudShwYW5lbFN0YXRlLm1lbnUpO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqICBHZXQgYWN0aXZlIE1lbnUgaWRcbiAgICAgKi9cbiAgICBnZXRNZW51SUQoKSB7XG4gICAgICAgIHJldHVybiAkKCcjbWVudVNlbGVjdG9yJykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIEVkaXRvciBsb2FkIHNlbGVjdGVkIG1lbnVcbiAgICAgKi9cbiAgICBsb2FkTWVudShtZW51X3R5cGVfaWQpIHtcbiAgICAgICAgdGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW4vbWVudS9saXN0TWVudXMvJyArIG1lbnVfdHlwZV9pZCArICcvJyArIHRoaXMuZWRpdG9yTG9jYWxlLFxuICAgICAgICAgICAgLy9kYXRhOiAnaWQ9JyttZW51X3R5cGVfaWQsXG4gICAgICAgICAgICBlcnJvcjogKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coeGhyLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kb25lKChodG1sKSA9PiB7XG4gICAgICAgICAgICAkKCcjbWVudUl0ZW1zJykuaHRtbChodG1sKVxuICAgICAgICAgICAgdGhpcy5pbml0TmVzdGFibGVNZW51KCQoJyNtZW51SXRlbXNMaXN0JykpO1xuICAgICAgICAgICAgdGhpcy5zYXZlUGFuZWxTdGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZ0luZGljYXRvcigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0TmVzdGFibGVNZW51KGVsZSkge1xuICAgICAgICBlbGUubmVzdGFibGUoe1xuICAgICAgICAgICAgbWF4RGVwdGg6IDJcbiAgICAgICAgfSkub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0xvYWRpbmdJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hZG1pbi9tZW51L3NvcnRvcmRlcicsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZWxlLm5lc3RhYmxlKCdhc05lc3RlZFNldCcpKSxcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgLypoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdYLUNTUkYtVG9rZW4nOiAkKCdtZXRhW25hbWU9XCJfdG9rZW5cIl0nKS5hdHRyKCdjb250ZW50JylcbiAgICAgICAgICAgICAgICB9LCovXG4gICAgICAgICAgICAgICAgZXJyb3I6ICh4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUxvYWRpbmdJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqICBFZGl0b3IgZWRpdCBtZW51IHdpbmRvd1xuICAgICAqL1xuICAgIGVkaXRNZW51KCkge1xuXG4gICAgICAgIHRoaXMub3BlbkRpYWxvZyh7XG4gICAgICAgICAgICBpZDogJ21lbnUtZWRpdCcsXG4gICAgICAgICAgICB0aXRsZTogJ0VkaXQnLFxuICAgICAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW4vbWVudS8nICsgdGhpcy5tZW51X3R5cGVfaWQgKyAnL3NldHRpbmdzJyArICcvJyArIHRoaXMuZWRpdG9yTG9jYWxlLFxuICAgICAgICAgICAgdHlwZTogJ2FqYXgnLFxuICAgICAgICAgICAgb25BZnRlclNob3c6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck1lbnVUeXBlU2VsZWN0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRNZW51KHRoaXMuZ2V0TWVudUlEKCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICAgICBvazogJ1NhdmUnLFxuICAgICAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZy5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqICBFZGl0b3IgbmV3IG1lbnUgd2luZG93XG4gICAgICovXG4gICAgYWRkTWVudShtZW51X3R5cGVfaWQpIHtcblxuICAgICAgICB0aGlzLm9wZW5EaWFsb2coe1xuICAgICAgICAgICAgaWQ6ICdtZW51LWFkZCcsXG4gICAgICAgICAgICB0aXRsZTogJ0NyZWF0ZSBhIG5ldyBtZW51JyxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgdXJsOiAnLycgKyB0aGlzLmVkaXRvckxvY2FsZSArICcvYWRtaW4vbWVudS9jcmVhdGUvJyArIG1lbnVfdHlwZV9pZCxcbiAgICAgICAgICAgIHR5cGU6ICdhamF4JyxcbiAgICAgICAgICAgIG9uQWZ0ZXJTaG93OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJNZW51VHlwZVNlbGVjdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkTWVudShtZW51X3R5cGVfaWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICAgICBvazogJ0NyZWF0ZScsXG4gICAgICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogR2xvYmFsIE1vZGFsIG9wZW4gd2luZG93XG4gICAgICovXG4gICAgb3BlbkRpYWxvZyhvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIGZvcm1Eb20gPSAkKCc8ZGl2PjwvZGl2PicpLmF0dHIoJ2lkJywgb3B0aW9ucy5pZCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBvcHRpb25zLnVybCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZSgoaHRtbCkgPT4ge1xuICAgICAgICAgICAgICAgIGZvcm1Eb20uaGlkZSgpLmFwcGVuZChodG1sKTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybURvbS5maW5kKCcudGFicycpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcudGFicycsIGZvcm1Eb20pLnRhYnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLyphY3RpdmF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKG9wdGlvbnMub25UYWJDaGFuZ2UpID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vblRhYkNoYW5nZShmb3JtRG9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihvcHRpb25zLm9uQ3JlYXRlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uQ3JlYXRlKGZvcm1Eb20pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQoZm9ybURvbSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RGlhbG9nKG9wdGlvbnMpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuICAgIHNob3dEaWFsb2cob3B0aW9ucykge1xuICAgICAgICB2YXIgZGlhbG9nID0gJCgnIycgKyBvcHRpb25zLmlkKTtcbiAgICAgICAgdmFyIGZvcm0gPSAkKCdmb3JtJywgZGlhbG9nKTtcblxuICAgICAgICBpZiAoZm9ybS5maW5kKCcudGFicycpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgJCgnLnRhYnMgdWwgbGkgYScsIGZvcm0pLmVxKDApLmNsaWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvcHRpb25zICs9IHtcbiAgICAgICAgLy8gICBcImVtYWlsX3R5cGVcIjogXCJkZWZhdWx0XCIsXG4gICAgICAgIC8vICAgXCJlbWFpbFwiOiBcIlwiLFxuICAgICAgICAvLyAgIFwic3ViamVjdFwiOiBcIlwiLFxuICAgICAgICAvLyAgIFwidGhhbmtzX21zZ1wiOiBcIlwiLFxuICAgICAgICAvLyAgIFwic3VibWl0XCI6IFwiZnNkZnNmZFwiLFxuICAgICAgICAvLyAgIFwic3R5bGVcIjogXCJzLWhvcml6b250YWxcIixcbiAgICAgICAgLy8gICBcImZpZWxkc1wiOiBbXG4gICAgICAgIC8vICAgICB7XG4gICAgICAgIC8vICAgICAgIFwidHlwZVwiOiBcInRleHRcIixcbiAgICAgICAgLy8gICAgICAgXCJ0aXRsZVwiOiBcIlRlc3RcIixcbiAgICAgICAgLy8gICAgICAgXCJpc01hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgIF19O1xuXG5cbiAgICAgICAgdmFyIGJ1dHRvbnMgPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mKG9wdGlvbnMuYnV0dG9ucy5vaykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBidXR0b25zW29wdGlvbnMuYnV0dG9ucy5va10gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJtaXRGb3JtKGRpYWxvZywgZm9ybSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIGJ1dHRvbnNbJ0Nsb3NlJ10gPSAoKSA9PiB7XG4gICAgICAgIC8vICAgICBkaWFsb2cuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAvLyAgICAgZGlhbG9nLnJlbW92ZSgpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAvLyBcbiAgICAgICAgaWYgKHR5cGVvZihvcHRpb25zLm9uU2hvdykgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG9wdGlvbnMub25TaG93KGZvcm0sIG9wdGlvbnMudmFsdWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpYWxvZy5kaWFsb2coe1xuICAgICAgICAgICAgdGl0bGU6IG9wdGlvbnMudGl0bGUsXG4gICAgICAgICAgICBtb2RhbDogb3B0aW9ucy5tb2RhbCxcbiAgICAgICAgICAgIGJ1dHRvbnM6IGJ1dHRvbnMsXG4gICAgICAgICAgICB3aWR0aDogdHlwZW9mKG9wdGlvbnMud2lkdGgpID09PSAndW5kZWZpbmVkJyA/IDQ1MCA6IG9wdGlvbnMud2lkdGgsXG4gICAgICAgICAgICBtaW5XaWR0aDogMzAwLFxuICAgICAgICAgICAgLy9taW5IZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgIG1pbkhlaWdodDogdHlwZW9mKG9wdGlvbnMubWluSGVpZ2h0KSA9PT0gJ3VuZGVmaW5lZCcgPyAnYXV0bycgOiBvcHRpb25zLm1pbkhlaWdodCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbXk6IFwiY2VudGVyIHRvcFwiLFxuICAgICAgICAgICAgICAgIGF0OiBcImNlbnRlciB0b3ArODBcIixcbiAgICAgICAgICAgICAgICBvZjogd2luZG93XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAvLyQodGhpcykuY2xvc2VzdCgnLnVpLWRpYWxvZycpLmZpbmQoXCIudWktZGlhbG9nLWJ1dHRvbnNldCAudWktYnV0dG9uOmZpcnN0XCIpLmFkZENsYXNzKFwiZ3JlZW5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKG9wdGlvbnMub25BZnRlclNob3cpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25BZnRlclNob3coKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgZGlhbG9nLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc3VibWl0Rm9ybShkaWFsb2csIGZvcm0sIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZihvcHRpb25zLm9uU3VibWl0KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvcHRpb25zKVxuICAgICAgICAgICAgb3B0aW9ucy5vblN1Ym1pdChvcHRpb25zLCBmb3JtKTtcbiAgICAgICAgICAgIGRpYWxvZy5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy50eXBlID09ICdhamF4Jykge1xuICAgICAgICAgICAgdmFyIGZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSBmb3JtLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIC8vIGRlZmluZSB0aGUgdHlwZSBvZiBIVFRQIHZlcmIgd2Ugd2FudCB0byB1c2UgKFBPU1QgZm9yIG91ciBmb3JtKVxuICAgICAgICAgICAgICAgIHVybDogYWN0aW9uLCAvLyB0aGUgdXJsIHdoZXJlIHdlIHdhbnQgdG8gUE9TVFxuICAgICAgICAgICAgICAgIGRhdGE6IGZvcm1EYXRhLCAvLyBvdXIgZGF0YSBvYmplY3RcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCAvLyB3aGF0IHR5cGUgb2YgZGF0YSBkbyB3ZSBleHBlY3QgYmFjayBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICBlbmNvZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZXJyb3I6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICQoXCJpbnB1dFwiKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJpbnB1dFwiKS5wcmV2KCkuZmluZCgnc3BhbicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gZGF0YS5yZXNwb25zZUpTT047XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChlcnJvcnMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiaW5wdXRbbmFtZT1cIiArIGtleSArIFwiXVwiKS5wYXJlbnQoKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiaW5wdXRbbmFtZT1cIiArIGtleSArIFwiXVwiKS5wcmV2KCkuYXBwZW5kKCcgPHNwYW4gY2xhc3M9XCJoYXMtZXJyb3JcIj4nICsgdmFsdWUgKyAnPC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmRvbmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGRpYWxvZy5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgLy9kaWFsb2cucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihvcHRpb25zLmNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm0uc3VibWl0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dNZXNzYWdlRGlhbG9nKG1lc3NhZ2UsIHRpdGxlKSB7XG5cbiAgICAgICAgdmFyIG1lc3NhZ2VIdG1sID0gbWVzc2FnZTtcblxuICAgICAgICBpZiAodHlwZW9mKG1lc3NhZ2UpID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICBtZXNzYWdlSHRtbCA9ICQoJzx1bD48L3VsPicpLmFkZENsYXNzKCdtZXNzYWdlcy1saXN0Jyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG1lc3NhZ2Upe1xuICAgICAgICAgICAgICAgIHZhciBpdGVtRG9tID0gJCgnPGxpPjwvbGk+JykuaHRtbChtZXNzYWdlW2ldKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlSHRtbC5hcHBlbmQoaXRlbURvbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYnV0dG9ucyA9IHt9O1xuXG4gICAgICAgIGJ1dHRvbnNbXCJva1wiXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkKCc8ZGl2IGNsYXNzPVwibWVzc2FnZS10ZXh0IGlubGluZWNtc1wiPjwvZGl2PicpLmFwcGVuZChtZXNzYWdlSHRtbCkuZGlhbG9nKHtcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdpZHRoOiAzNTAsXG4gICAgICAgICAgICBidXR0b25zOiBidXR0b25zXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIHNob3dQcm9tcHREaWFsb2cobWVzc2FnZSwgdGl0bGUsIG9uU3VibWl0LCBkZWZhdWx0VmFsdWUpIHtcblxuICAgICAgICB2YXIgZm9ybSA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdtZXNzYWdlLXByb21wdCBpbmxpbmVjbXMnKTtcbiAgICAgICAgdmFyIHByb21wdCA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdwcm9tcHQnKS5odG1sKG1lc3NhZ2UpO1xuICAgICAgICB2YXIgaW5wdXQgPSAkKCc8aW5wdXQvPicpLmF0dHIoJ3R5cGUnLCAndGV4dCcpLnZhbChkZWZhdWx0VmFsdWUpO1xuXG4gICAgICAgIHZhciBidXR0b25zID0ge307XG5cbiAgICAgICAgYnV0dG9uc1snb2snXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvblN1Ym1pdChpbnB1dC52YWwoKSk7XG4gICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgfTtcblxuICAgICAgICBidXR0b25zWydjYW5jZWwnXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3JtLmFwcGVuZChwcm9tcHQpLmFwcGVuZChpbnB1dCkuZGlhbG9nKHtcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdpZHRoOiAzNTAsXG4gICAgICAgICAgICBidXR0b25zOiBidXR0b25zLFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc2hvd0NvbmZpcm1hdGlvbkRpYWxvZyhtZXNzYWdlLCBvbkNvbmZpcm0sIG9uQ2FuY2VsKSB7XG5cbiAgICAgICAgdmFyIGJ1dHRvbnMgPSB7fTtcblxuICAgICAgICBidXR0b25zW1wieWVzXCJdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKG9uQ29uZmlybSkgPT09ICdmdW5jdGlvbicpIHsgb25Db25maXJtKCk7IH1cbiAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGJ1dHRvbnNbXCJub1wiXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZihvbkNhbmNlbCkgPT09ICdmdW5jdGlvbicpIHsgb25DYW5jZWwoKTsgfVxuICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJCgnPGRpdiBjbGFzcz1cIm1lc3NhZ2UtdGV4dCBqb2RlbGNtc1wiPjwvZGl2PicpLmFwcGVuZChtZXNzYWdlKS5kaWFsb2coe1xuICAgICAgICAgICAgdGl0bGU6IFwiY29uZmlybWF0aW9uXCIsXG4gICAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3aWR0aDogMzUwLFxuICAgICAgICAgICAgYnV0dG9uczogYnV0dG9ucyxcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnVpLWRpYWxvZycpLmZpbmQoXCIudWktZGlhbG9nLWJ1dHRvbnNldCAudWktYnV0dG9uOmZpcnN0XCIpLmFkZENsYXNzKFwiZ3JlZW5cIik7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcudWktZGlhbG9nJykuZmluZChcIi51aS1kaWFsb2ctYnV0dG9uc2V0IC51aS1idXR0b246bGFzdFwiKS5hZGRDbGFzcyhcInJlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgLy8gZ2V0RWxlbWVudE9wdGlvbnMoZWxlbWVudElkKXtcblxuICAgIC8vICAgICAvLyBhbGVydChKU09OLnN0cmluZ2lmeSh0aGlzLmVkaXRvckZyYW1lLmdldCgwKS5jb250ZW50V2luZG93Lm9wdGlvbnMpKTtcbiAgICAvLyAgICAgY29uc29sZS5sb2coZWxlbWVudElkKVxuICAgIC8vICAgICByZXR1cm4gJ3tcInNpemVcIjogXCI2MFwiIH0nO1xuICAgIC8vICAgICAkLmFqYXgoe1xuICAgIC8vICAgICAgICAgICAgIHR5cGU6ICdHRVQnLCAvLyBkZWZpbmUgdGhlIHR5cGUgb2YgSFRUUCB2ZXJiIHdlIHdhbnQgdG8gdXNlIChQT1NUIGZvciBvdXIgZm9ybSlcbiAgICAvLyAgICAgICAgICAgICB1cmw6ICcvYWRtaW4vZWxlbWVudC8nK2VsZW1lbnRJZCwgLy8gdGhlIHVybCB3aGVyZSB3ZSB3YW50IHRvIFBPU1RcbiAgICAvLyAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCAvLyB3aGF0IHR5cGUgb2YgZGF0YSBkbyB3ZSBleHBlY3QgYmFjayBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAvLyAgICAgICAgICAgICBlbmNvZGU6IHRydWUsXG4gICAgLy8gICAgICAgICAgICAgZXJyb3I6IChkYXRhKSA9PiB7XG5cbiAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfSkuZG9uZSgoZGF0YSkgPT4ge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiAne1wic2l6ZVwiOiA2MCB9JztcbiAgICAvLyAgICAgICAgIH0pO1xuXG4gICAgLy8gICAgIC8vIHZhciB3aWRnZXQgPSB0aGlzLmdldFdpZGdldChyZWdpb25JZCwgd2lkZ2V0SWQpO1xuICAgIC8vICAgICAvLyByZXR1cm4gd2lkZ2V0Lm9wdGlvbnM7XG4gICAgLy8gICAgIC8vcmV0dXJuICd7XCJzaXplXCI6XCI2MFwifSc7XG4gICAgLy8gICAgIC8vXG4gICAgLy8gICAgIC8vIHJldHVybiB7XCJlbWFpbF90eXBlXCI6IFwiZGVmYXVsdFwiLFxuICAgIC8vICAgICAvLyAgIFwiZW1haWxcIjogXCJcIixcbiAgICAvLyAgICAgLy8gICBcInN1YmplY3RcIjogXCJcIixcbiAgICAvLyAgICAgLy8gICBcInRoYW5rc19tc2dcIjogXCJcIixcbiAgICAvLyAgICAgLy8gICBcInN1Ym1pdFwiOiBcImZzZGZzZmRcIixcbiAgICAvLyAgICAgLy8gICBcInN0eWxlXCI6IFwicy1ob3Jpem9udGFsXCIsXG4gICAgLy8gICAgIC8vICAgXCJmaWVsZHNcIjogW1xuICAgIC8vICAgICAvLyAgICAge1xuICAgIC8vICAgICAvLyAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgLy8gICAgIC8vICAgICAgIFwidGl0bGVcIjogXCJUZXN0XCIsXG4gICAgLy8gICAgIC8vICAgICAgIFwiaXNNYW5kYXRvcnlcIjogZmFsc2VcbiAgICAvLyAgICAgLy8gICAgIH1cbiAgICAvLyAgICAgLy8gICBdfTtcblxuICAgIC8vIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYWxsIEVsZW1lbnRzXG4gICAgICovXG4gICAgcmVnaXN0ZXJFbGVtZW50SGFuZGxlcihpZCwgaGFuZGxlcikge1xuXG4gICAgICAgIGhhbmRsZXIuZ2V0VGl0bGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vcmV0dXJuIGNtcy5sYW5nKFwid2lkZ2V0VGl0bGVfXCIgKyB0aGlzLmdldE5hbWUoKSk7XG4gICAgICAgICAgICAvL3JldHVybiAnVGV4dEJsb2NrJztcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE5hbWUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRIYW5kbGVyc1tpZF0gPSBoYW5kbGVyO1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIEVkaXRvciBsaXN0IG9mIEVsZW1lbnRzXG4gICAgICovXG4gICAgYnVpbGRFbGVtZW50c0xpc3QoKSB7XG5cbiAgICAgICAgbGV0IGVsZW1lbnRzTGlzdCA9ICQoJyN0YWItZWxlbWVudHMgLmxpc3QgdWwnLCB0aGlzLmVkaXRvclBhbmVsKTtcblxuICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuZWxlbWVudHNMaXN0KSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudElkID0gdGhpcy5lbGVtZW50c0xpc3RbaV07XG5cbiAgICAgICAgICAgIGxldCB0aXRsZSA9IHRoaXMuZWxlbWVudEhhbmRsZXJzW2VsZW1lbnRJZF0uZ2V0VGl0bGUoKTtcbiAgICAgICAgICAgIGxldCBpY29uID0gdGhpcy5lbGVtZW50SGFuZGxlcnNbZWxlbWVudElkXS5nZXRJY29uKCk7XG5cbiAgICAgICAgICAgIGxldCBpdGVtID0gJCgnPGxpPjwvbGk+JykuYXR0cignZGF0YS1pZCcsIGVsZW1lbnRJZCkuYWRkQ2xhc3MoJ2VkaXRvci1lbGVtZW50Jyk7XG4gICAgICAgICAgICBpdGVtLmh0bWwoJzxpIGNsYXNzPVwiZmEgJyArIGljb24gKyAnXCI+PC9pPicpO1xuICAgICAgICAgICAgaXRlbS5hdHRyKCd0aXRsZScsIHRpdGxlKTtcbiAgICAgICAgICAgIGl0ZW0udG9vbHRpcCh7XG4gICAgICAgICAgICAgICAgdHJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGlkZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxlbWVudHNMaXN0LmFwcGVuZChpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2xpJywgZWxlbWVudHNMaXN0KS5kcmFnZ2FibGUoe1xuICAgICAgICAgICAgaGVscGVyOiBcImNsb25lXCIsXG4gICAgICAgICAgICBpZnJhbWVGaXg6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgdGhlIGVkaXRhYmxlIEVsZW1lbnRzXG4gICAgICovXG4gICAgaW5pdEVsZW1lbnRzKHJlZ2lvbikge1xuICAgICAgICByZWdpb24uZmluZCgnPmRpdicpLmVhY2goKGksIGVsbSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgZWxlbWVudERvbSA9ICQoZWxtKTtcblxuICAgICAgICAgICAgbGV0IHR5cGUgPSBlbGVtZW50RG9tLmRhdGEoJ3R5cGUnKTtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyID0gdGhpcy5lbGVtZW50SGFuZGxlcnNbdHlwZV07XG5cbiAgICAgICAgICAgIGhhbmRsZXIuaW5pdEVsZW1lbnQoZWxlbWVudERvbSwgKGVsZW1lbnREb20sIHR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkRWxlbWVudFRvb2xiYXIoZWxlbWVudERvbSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGVsZW1lbnRzIFRvb2xiYXJcbiAgICAgKi9cbiAgICBidWlsZEVsZW1lbnRUb29sYmFyKGVsZW1lbnREb20sIGhhbmRsZXIpIHtcblxuICAgICAgICBpZiAodHlwZW9mKGhhbmRsZXIudG9vbGJhckJ1dHRvbnMpID09PSAndW5kZWZpbmVkJykge1xuXG4gICAgICAgICAgICB2YXIgZGVmYXVsdFRvb2xiYXJCdXR0b25zID0ge1xuICAgICAgICAgICAgICAgIFwib3B0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIGljb246IFwiZmEtd3JlbmNoXCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnT3B0aW9ucydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGljb246IFwiZmEtYXJyb3dzXCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTW92ZScsXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoZWxlbWVudERvbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGljb246IFwiZmEtdHJhc2hcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICBjbGljazogKGVsZW1lbnREb20pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlRWxlbWVudChlbGVtZW50RG9tKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBidXR0b25zID0ge307XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YoaGFuZGxlci5nZXRUb29sYmFyQnV0dG9ucykgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBidXR0b25zID0gaGFuZGxlci5nZXRUb29sYmFyQnV0dG9ucygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoYW5kbGVyLnRvb2xiYXJCdXR0b25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRUb29sYmFyQnV0dG9ucywgYnV0dG9ucyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b29sYmFyID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdpbmxpbmUtdG9vbGJhcicpLmFkZENsYXNzKCdqb2RlbGNtcycpO1xuICAgICAgICB2YXIgaXNGaXhlZFJlZ2lvbiA9IGVsZW1lbnREb20ucGFyZW50cygnLmpvZGVsY21zLXJlZ2lvbi1maXhlZCcpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgJC5tYXAoaGFuZGxlci50b29sYmFyQnV0dG9ucywgZnVuY3Rpb24oYnV0dG9uLCBidXR0b25JZCkge1xuXG4gICAgICAgICAgICBpZiAoYnV0dG9uID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBidXR0b247IH1cbiAgICAgICAgICAgIGlmIChidXR0b25JZCA9PSAnbW92ZScgJiYgaXNGaXhlZFJlZ2lvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBidXR0b247IH1cbiAgICAgICAgICAgIGlmIChidXR0b25JZCA9PSAnZGVsZXRlJyAmJiBpc0ZpeGVkUmVnaW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbjsgfVxuXG4gICAgICAgICAgICB2YXIgYnV0dG9uRG9tID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYnV0dG9uJykuYWRkQ2xhc3MoJ2ItJyArIGJ1dHRvbklkKTtcbiAgICAgICAgICAgIGJ1dHRvbkRvbS5hdHRyKCd0aXRsZScsIGJ1dHRvbi50aXRsZSk7XG4gICAgICAgICAgICBidXR0b25Eb20uaHRtbCgnPGkgY2xhc3M9XCJmYSAnICsgYnV0dG9uLmljb24gKyAnXCI+PC9pPicpO1xuXG4gICAgICAgICAgICB0b29sYmFyLmFwcGVuZChidXR0b25Eb20pO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mKGJ1dHRvbi5jbGljaykgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBidXR0b25Eb20uY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soZWxlbWVudERvbSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBidXR0b247XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudERvbS5hcHBlbmQodG9vbGJhcik7XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgZWRpdGFibGUgUmVnaW9uc1xuICAgICAqL1xuICAgIGluaXRSZWdpb25zKCkge1xuICAgICAgICAkKCcuam9kZWxSZWdpb24nLCB0aGlzLmVkaXRvckZyYW1lLmNvbnRlbnRzKCkpLmVhY2goKGksIGVsbSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlZ2lvbiA9ICQoZWxtKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEVsZW1lbnRzKHJlZ2lvbik7XG5cbiAgICAgICAgICAgIHZhciBkcm9wWm9uZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Ryb3AtaGVscGVyJykuYWRkQ2xhc3MoJ2pvZGVsY21zJyk7XG4gICAgICAgICAgICBkcm9wWm9uZS5odG1sKCc8aSBjbGFzcz1cImZhIGZhLXBsdXMtY2lyY2xlXCI+PC9pPicpO1xuXG4gICAgICAgICAgICByZWdpb24uYXBwZW5kKGRyb3Bab25lKTtcblxuICAgICAgICAgICAgJCgnLmRyb3AtaGVscGVyJywgcmVnaW9uKS5oaWRlKCk7XG5cbiAgICAgICAgICAgIGlmIChyZWdpb24uaGFzQ2xhc3MoJ2pvZGVsY21zLXJlZ2lvbi1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgIHJlZ2lvbi5kcm9wcGFibGUoe1xuICAgICAgICAgICAgICAgIGFjY2VwdDogXCIuZWRpdG9yLWVsZW1lbnRcIixcbiAgICAgICAgICAgICAgICBvdmVyOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5kcm9wLWhlbHBlcicsIHJlZ2lvbikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5kcm9wLWhlbHBlcicsIHJlZ2lvbikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZHJvcDogKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKCcuZHJvcC1oZWxwZXInLCByZWdpb24pLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFbGVtZW50KHJlZ2lvbiwgdWkuZHJhZ2dhYmxlLmRhdGEoJ2lkJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZWdpb24uc29ydGFibGUoe1xuICAgICAgICAgICAgICAgIGhhbmRsZTogJy5iLW1vdmUnLFxuICAgICAgICAgICAgICAgIC8vYXhpczogJ3knLFxuICAgICAgICAgICAgICAgIGNvbm5lY3RXaXRoOiAnLmpvZGVsUmVnaW9uJyxcbiAgICAgICAgICAgICAgICB1cGRhdGU6IChldmVudCwgdWkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIGFkZEVsZW1lbnQocmVnaW9uRG9tLCB0eXBlKSB7XG4gICAgICAgIC8vYWxlcnQodHlwZSlcbiAgICAgICAgbGV0IHJlZ2lvbklkID0gcmVnaW9uRG9tLmRhdGEoJ3JlZ2lvbi1pZCcpO1xuICAgICAgICBsZXQgZWxlbWVudE9yZGVyID0gcmVnaW9uRG9tLmZpbmQoJz5kaXYnKS5sZW5ndGggLSAxO1xuICAgICAgICBsZXQgdG90YWxFbGVtZW50cyA9IHRoaXMuZWRpdG9yRnJhbWUuY29udGVudHMoKS5maW5kKCdkaXYuam9kZWxjbXMtZWxlbWVudCcpLmxlbmd0aDtcbiAgICAgICAgbGV0IGR1bW15SUQgPSBOdW1iZXIodG90YWxFbGVtZW50cykrMTtcblxuICAgICAgICBsZXQgaGFuZGxlciA9IHRoaXMuZWxlbWVudEhhbmRsZXJzW3R5cGVdO1xuICAgICAgICBsZXQgb3B0aW9ucyA9IGhhbmRsZXIuZGVmYXVsdE9wdGlvbnM7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgLy8gZGVmaW5lIHRoZSB0eXBlIG9mIEhUVFAgdmVyYiB3ZSB3YW50IHRvIHVzZSAoUE9TVCBmb3Igb3VyIGZvcm0pXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW4vZWxlbWVudC9hZGQnLCAvLyB0aGUgdXJsIHdoZXJlIHdlIHdhbnQgdG8gUE9TVFxuICAgICAgICAgICAgZGF0YTogeyAnaWQnOiByZWdpb25JZCwgJ2R1bW15SUQnOiBkdW1teUlELCAndHlwZSc6IHR5cGUsICdvcHRpb25zJzogSlNPTi5zdHJpbmdpZnkob3B0aW9ucyksICdvcmRlcic6IGVsZW1lbnRPcmRlciB9LCAvLyBvdXIgZGF0YSBvYmplY3RcbiAgICAgICAgICAgIC8vZGF0YVR5cGU6ICdqc29uJywgLy8gd2hhdCB0eXBlIG9mIGRhdGEgZG8gd2UgZXhwZWN0IGJhY2sgZnJvbSB0aGUgc2VydmVyXG4gICAgICAgICAgICBlbmNvZGU6IHRydWUsXG4gICAgICAgICAgICBlcnJvcjogKGRhdGEpID0+IHt9XG4gICAgICAgIH0pLmRvbmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50RG9tID0gJChkYXRhKTtcbiAgICAgICAgICAgICQoJy5kcm9wLWhlbHBlcicsIHJlZ2lvbkRvbSkuYmVmb3JlKGVsZW1lbnREb20pO1xuXG4gICAgICAgICAgICBoYW5kbGVyLmNyZWF0ZUVsZW1lbnQocmVnaW9uSWQsIGVsZW1lbnREb20sIChlbGVtZW50RG9tLCB0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZEVsZW1lbnRUb29sYmFyKGVsZW1lbnREb20sIGhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNldENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBhbiBFbGVtZW50XG4gICAgICovXG4gICAgZGVsZXRlRWxlbWVudChlbGVtZW50RG9tKSB7XG5cbiAgICAgICAgbGV0IGVsZW1lbnRJZCA9IGVsZW1lbnREb20uYXR0cignaWQnKTtcbiAgICAgICAgbGV0IGVpZCA9IGVsZW1lbnRJZC5yZXBsYWNlKCdlbGVtZW50XycsICcnKTtcbiAgICAgICAgbGV0IHR5cGUgPSBlbGVtZW50RG9tLmRhdGEoJ3R5cGUnKTtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSB0aGlzLmVsZW1lbnRIYW5kbGVyc1t0eXBlXTtcblxuICAgICAgICB0aGlzLnNob3dDb25maXJtYXRpb25EaWFsb2coJ0RlbGV0ZSB0aGlzIEVsZW1lbnQnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgIGlmKCAhIGVsZW1lbnREb20uaGFzQ2xhc3MoJ2R1bW15JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzVG9EZWxldGUucHVzaChlaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZihoYW5kbGVyLmRlbGV0ZUVsZW1lbnQpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5kZWxldGVFbGVtZW50KGVsZW1lbnREb20pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50RG9tLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn1cblxuZXhwb3J0IHsgRWRpdG9yIH0iLCIvLyBpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuLy8gaW1wb3J0IGpRdWVyeSBmcm9tICdqcXVlcnknO1xuLy8gd2luZG93LiQgPSAkO1xuLy8gd2luZG93LmpRdWVyeSA9IGpRdWVyeTtcblxuLy8gaW1wb3J0ICdib290c3RyYXAtc2Fzcyc7XG5cbmltcG9ydCB7IEVkaXRvciB9IGZyb20gJy4vZWRpdG9yL2VkaXRvcic7XG53aW5kb3cuZWRpdG9yID0gbmV3IEVkaXRvcigpO1xuXG4kKGZ1bmN0aW9uKCkge1xuICAgIGVkaXRvci5pbml0UGFuZWwoKTtcbn0pOyJdLCJuYW1lcyI6WyJ0aGlzIiwibGV0Il0sIm1hcHBpbmdzIjoiOzs7QUFDQSxJQUFNLE1BQU0sR0FBQyxlQUVFLEdBQUc7SUFDZCxJQUFRLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMxQyxJQUFRLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFD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