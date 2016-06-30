"use strict";
class Editor {

    constructor() {
        this.editorPanel = $('#editor-panel');
        this.editorPanelCollapse = $('#modal-toggle');
        this.formsLoaded = {};
        this.page_id = 0;
        this.editorFrame = $("#editorIFrame");

    }

    showLoadingIndicator() {
        $('#editor-loading').show();
    };

    hideLoadingIndicator() {
        $('#editor-loading').fadeOut();
    };


    initPanel() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        this.editorFrame.load(() => {
            $('a[target!=_blank]', this.editorFrame.contents()).attr('target', '_top');
        });

        this.editorPanel.draggable({
            handle: ".modal-header",
            iframeFix: true,
            cursor: "move",
            containment: "document",
            stop: () => {
                this.savePanelState();
                this.editorPanel.css({ height: 'auto' });
            }
        });

        $(window).resize(() => {
            let windowWidth = $(window).width();
            let windowHeight = $(window).height();
            let left = $("#editor-panel").position().left;
            let width = $("#editor-panel").width();
            let top = $("#editor-panel").position().top;
            let height = $("#editor-panel").height();
            if (windowWidth < left + width) {
                let newLeft = left - ((left + width) - windowWidth);
                if (newLeft < 0) { newLeft = 0; }
                $("#editor-panel").css({ left: newLeft });
            }
            if (windowHeight < top + height) {
                let newTop = top - ((top + height) - windowHeight);
                if (newTop < 0) { newTop = 0; }
                $("#editor-panel").css({ top: newTop });
            }
            this.savePanelState();
        });

        $('.modal-header .tb-collapse', this.editorPanel).on('click', (e) => {
            e.preventDefault();
            this.editorPanelCollapse.slideToggle(250, () => {
                this.savePanelState();
            });
            $('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
        });

        $('.modal-header .tb-refresh', this.editorPanel).on('click', (e) => {
            e.preventDefault();
            this.editorFrame.get(0).contentWindow.location.reload(true);
        });

        $("#tabs").tabs({
            activate: (event, ui) => {
                this.savePanelState();
            },
            create: (event, ui) => {
                this.restorePanelState();
            }
        });

        $(".tabs").tabs({});


        /**
         *	Open new page dialog
         */
        $('#tab-pages', this.editorPanel).on('click', '.btn-create', (e) => {
            e.preventDefault();
            this.addPage();
        });

        /**
         *	Load a page in iFrame
         */
        $('#tab-pages', this.editorPanel).on('click', '.load', (e) => {
            e.preventDefault();
            this.showLoadingIndicator();
            let src = $(e.target).data('url');
            this.editorFrame.attr('src', src).load(() => {
                this.hideLoadingIndicator();
            });
        });

        /**
         *	Open edit page dialog
         */
        $('#tab-pages', this.editorPanel).on('click', '.edit', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.page_id = parent.data('id');
            this.editPage();
        });

        /**
         *	Delete a page
         */
        $('#tab-pages', this.editorPanel).on('click', '.delete', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            let page_id = parent.data('id');

            let message = 'Are you sure you want to delete page?';

            this.showConfirmationDialog(message, () => {
                this.showLoadingIndicator();
                $.ajax({
                    type: 'POST',
                    url: '/page/delete',
                    data: 'id=' + page_id,
                    error: (xhr, ajaxOptions, thrownError) => {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                }).done(() => {
                    parent.slideUp(() => {
                        parent.remove();
                        this.hideLoadingIndicator();
                    });
                });
            });
        });










        /**
        /* Menu funtions
        */
        $('.nestable').nestable({
            maxDepth: 3
        }).on('change', () => {
            this.showLoadingIndicator();
            $.ajax({
                type: 'POST',
                url: '/menu/sortorder',
                data: JSON.stringify($('.nestable').nestable('asNestedSet')),
                contentType: "json",
                /*headers: {
                    'X-CSRF-Token': $('meta[name="_token"]').attr('content')
                },*/
                error: (xhr, ajaxOptions, thrownError) => {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done(() => {
                this.hideLoadingIndicator();
            });
        });


        /**
         *	Open new menu dialog
         */
        $('#tab-menus', this.editorPanel).on('click', '.btn-create', (e) => {
            e.preventDefault();
            //let menu_id = $('#menuSelector').find('option:selected').val();
            this.addMenu( this.getMenuID() );
        });


        /**
         *  Open edit menu dialog
         */
        $('#tab-menus', this.editorPanel).on('click', '.edit', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.menu_id = parent.data('id');
            this.editMenu();
        });


        /**
         *	Toggle menu active state
         */
        $('#tab-menus', this.editorPanel).on('click', '.toggleActive', (e) => {
            e.preventDefault();
            this.showLoadingIndicator();
            let menu_id = $(e.target).parents('.dd-item').data('id');
            let active = $(e.target).data('active');
            $.ajax({
                type: 'POST',
                url: '/menu/active',
                data: 'id=' + menu_id + '&active=' + active,
                error: (xhr, ajaxOptions, thrownError) => {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done(() => {
                $(e.target).toggleClass("fa-circle-o").toggleClass("fa-circle");
                this.hideLoadingIndicator();
            });
        });


        /**
         *	Delete a menu
         */
        $('#tab-menus', this.editorPanel).on('click', '.delete', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            let menu_id = parent.data('id');

            let message = 'Are you sure you want to delete menu item?';

            this.showConfirmationDialog(message, () => {
                this.showLoadingIndicator();
                $.ajax({
                    type: 'POST',
                    url: '/menu/delete',
                    data: 'id=' + menu_id,
                    error: (xhr, ajaxOptions, thrownError) => {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                }).done(() => {
                    parent.slideUp(() => {
                        parent.remove();
                        this.hideLoadingIndicator();
                    });
                });
            });
        });

        /**
         *	Select a menu
         */
        $('#menuSelector', this.editorPanel).on('change', (e) => {
            //let menu_id = $('#menuSelector').find('option:selected').val();
            this.loadMenu( this.getMenuID() );
        });

        /**
         *  Menu item type form select
         */
        $('body').on('change','#menuTypeSelector', (e) => {
            let ele = $('#menuTypeItemSelector');
            let selected = $('#menuTypeSelector').find('option:selected').val();
            $.ajax({
                type: 'GET',
                url: '/admin/menuSelectorType/' + selected,
                //data: 'id='+menu_id,
                error: (xhr, ajaxOptions, thrownError) => {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done((data) => {
                ele.empty();
                //ele.append('<option value="0">-- Auswahl --</option>');
                for (var i = 0; i < data.length; i++) {
                    ele.append('<option value="' + data[i].id + '">' + data[i].title + '</option>');
                }
            });
        });

    }

    /**
     *  Editor load all pages
     */
    loadPages() {
        this.showLoadingIndicator();
        $.ajax({
            type: 'GET',
            url: '/admin/page/listPages',
            //data: 'id='+menu_id,
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done((html) => {
            $('#pageItems').html(html)
            this.hideLoadingIndicator();
        });
    }

    /**
     *	Editor edit page window
     */
    editPage() {
        $('#page-edit').remove();
        delete this.formsLoaded['page-edit'];
        this.openDialog({
            id: 'page-edit',
            title: 'Edit',
            url: '/page/' + this.page_id + '/settings',
            type: 'ajax',
            callback: () => {
                this.loadPages();
            },
            buttons: {
                ok: 'Save',
                Cancel: () => {
                    this.dialog.dialog("close");
                }
            }
        });
    };


    /**
     * Editor add page window
     */
    addPage() {
        this.openDialog({
            id: 'page-add',
            title: 'Create a new Page',
            url: '/admin/forms/page/create',
            type: '',
            buttons: {
                ok: 'Create',
                Cancel: () => {
                    this.dialog.dialog("close");
                }
            }
        });
    };


    /**
     * save Editor State
     */
    savePanelState() {
        let activeTab = $('#tabs').tabs("option", "active");
        // let active menu
        let activeMenu = $('#menuSelector', this.editorPanel).val();
        localStorage.setItem("editor-panel", JSON.stringify({
            position: this.editorPanel.position(),
            tab: activeTab,
            menu: activeMenu,
            expanded: $('#modal-toggle:visible', this.editorPanel).length
        }));
    };


    /**
     * restore Editor State
     */
    restorePanelState() {
        this.editorPanel.fadeIn();
        let panelState = {};
        if (!localStorage.getItem("editor-panel")) {
            panelState = {
                position: { left: 50, top: 150 },
                tab: 0,
                menu: 1,
                expanded: true
            };
        } else {
            panelState = JSON.parse(localStorage.getItem("editor-panel"))
        }
        this.editorPanel.css(panelState.position);
        $('#tabs').tabs("option", "active", panelState.tab);
        $("#menuSelector > [value=" + panelState.menu + "]").attr("selected", "true");
        this.loadMenu(panelState.menu);
        if (!panelState.expanded) {
            this.editorPanelCollapse.hide();
            $('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
        }
    };

    // ad page and prepare dialog details
    //openDialog
    //openform
    
    /**
    *  Get active Menu id
    */
   getMenuID() {
        return $('#menuSelector').find('option:selected').val();
   }

   /**
     *  Editor load selected menu
     */
    loadMenu(menu_id) {
        this.showLoadingIndicator();
        $.ajax({
            type: 'GET',
            url: '/admin/menu/listMenus/' + menu_id,
            //data: 'id='+menu_id,
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done((html) => {
            $('#menuItems').html(html)
            this.savePanelState();
            this.hideLoadingIndicator();
        });
    }


    /**
     *  Editor edit menu window
     */
    editMenu() {
        $('#menu-edit').remove();
        delete this.formsLoaded['menu-edit'];
        this.openDialog({
            id: 'menu-edit',
            title: 'Edit',
            url: '/menu/' + this.menu_id + '/settings',
            type: 'ajax',
            onAfterShow: () => {
                let ele = $('#menuTypeItemSelector');
            let selected = $('#menuTypeSelector').find('option:selected').val();
            $.ajax({
                type: 'GET',
                url: '/admin/menuSelectorType/' + selected,
                //data: 'id='+menu_id,
                error: (xhr, ajaxOptions, thrownError) => {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done((data) => {
                ele.empty();
                //ele.append('<option value="0">-- Auswahl --</option>');
                let selected = $('#morpher_id_orig').text();
                for (var i = 0; i < data.length; i++) {
                    let sel = '';
                    if(data[i].id == selected) {
                        sel = ' selected="selected"';
                    }
                    ele.append('<option value="' + data[i].id + '"' + sel + '>' + data[i].title + '</option>');
                }
            });
            },
            callback: () => {
                this.loadMenu( this.getMenuID() );
            },
            cache: false,
            buttons: {
                ok: 'Save',
                Cancel: () => {
                    this.dialog.dialog("close");
                }
            }
        });
    };



    addMenu(menu_id) {
        $('#menu-add').remove();
        delete this.formsLoaded['menu-add'];
        this.openDialog({
            id: 'menu-add',
            title: 'Create a new menu',
            url: '/admin/forms/menu/create/' + menu_id,
            type: 'ajax',
            callback: () => {
                this.loadMenu(menu_id);
            },
            buttons: {
                ok: 'Create',
                Cancel: () => {
                    this.dialog.dialog("close");
                }
            }
        });
    };

    openDialog(options) {
        var isFormDomLoaded = typeof(this.formsLoaded[options.id]) !== 'undefined';

        if (!isFormDomLoaded || options.cache === false) {
            this.loadDialog(options);
            return;
        }
        this.showDialog(options);
    }

    loadDialog(options) {
        $('#'+options.id).remove();
        var formDom = $('<div></div>').attr('id', options.id);
        $.ajax({
                url: options.url,
            })
            .done((html) => {
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
                $('body').append(formDom);
                this.formsLoaded[options.id] = true;
                this.showDialog(options);
            });
    }



    showDialog(options) {
        var dialog = $('#' + options.id);

        var buttons = {};

        buttons[options.buttons.ok] = () => {
            var form = $('form', dialog);
            this.submitForm(dialog, form, options);
        };
        buttons['Close'] = () => {
            dialog.dialog('close');
        };

        dialog.dialog({
            title: options.title,
            modal: true,
            buttons: buttons,
            width: typeof(options.width) === 'undefined' ? 450 : options.width,
            minWidth: 300,
            /*position: {
                my: "center top",
                at: "center top+50",
                of: window
            },*/
            open:function () {

                //$(this).closest('.ui-dialog').find(".ui-dialog-buttonset .ui-button:first").addClass("green");

                if (typeof(options.onAfterShow) === 'function'){
                    options.onAfterShow();
                }

            }
        });
    };

    submitForm(dialog, form, options) {
        if (options.type == 'ajax') {
            var formData = form.serialize();
            let action = form.attr('action');
            $.ajax({
                type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                url: action, // the url where we want to POST
                data: formData, // our data object
                dataType: 'json', // what type of data do we expect back from the server
                encode: true
            }).done((data) => {
                dialog.dialog('close');
                //dialog.remove();
                if (typeof(options.callback) === 'function') {
                    options.callback();
                }

            });
        } else {
            form.submit()
        }


    }

    showConfirmationDialog(message, onConfirm, onCancel) {

        var buttons = {};

        buttons["yes"] = function() {
            if (typeof(onConfirm) === 'function') { onConfirm(); }
            $(this).dialog('close');
        };

        buttons["no"] = function() {
            if (typeof(onCancel) === 'function') { onCancel(); }
            $(this).dialog('close');
        };

        $('<div class="message-text inlinecms"></div>').append(message).dialog({
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




}

$(function() {

    let editor = new Editor();
    editor.initPanel()


});
