"use strict";
class Editor {

    constructor() {
        this.editorPanel = $('#editor-panel');
        this.editorPanelWidth = 430;
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
    }

    setChanges() {
        this.hasUnsavedChanges = true;
        $('#save-outer').show();
        //$('.btn-save', this.panel).addClass('glow').find('i').removeClass('fa-check').addClass('fa-exclamation-circle');
    };

    hasChanges() {
        return this.hasUnsavedChanges;
    };

    noChanges() {
        this.hasUnsavedChanges = false;
        $('#save-outer').hide();
        //$('.btn-save', this.panel).removeClass('glow').find('i').removeClass('fa-exclamation-circle').addClass('fa-check');
    };

    showLoadingIndicator() {
        $('#editor-loading').show();
    };

    hideLoadingIndicator() {
        $('#editor-loading').fadeOut();
    };

    injectScript(url, callback) {

        let doc = this.editorFrame.get(0).contentWindow.document;
        let head = doc.getElementsByTagName('body')[0];
        let script = doc.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);

    };

    initPanel() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        this.editorFrame.on('load', () => {

            $('a[target!=_blank]', this.editorFrame.contents()).attr('target', '_top');
            this.initRegions();
            // alert(JSON.stringify(this.editorFrame.get(0).contentWindow.eoptions));

        });

        //Save Keyboard shortcut if editor is in focus
        $(document).keydown((e) => {
            if ((e.ctrlKey || e.metaKey) && e.which == 83) {
                e.preventDefault();
                this.editorFrame.get(0).contentWindow.saveContent();
                //this.hasUnsavedChanges = false;
            }
        });

        this.editorPanel.draggable({
            handle: ".modal-header",
            iframeFix: true,
            cursor: "move",
            containment: "document",
            drag: function(event, ui) {
                if (ui.position.top < 0) {
                    ui.position.top = 0;
                }
                if (ui.position.left < 0) {
                    ui.position.left = 0;
                }
            },
            stop: () => {
                this.savePanelState();
                this.editorPanel.css({ height: 'auto' });
            }
        });

        this.buildElementsList();


        /**
         * Boostrap tooltips
         */
        $('[data-toggle="tooltip"]').tooltip({
            animation: false
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
            if (this.editorPinned) {
                this.editorFrame.width($(window).width() - this.editorPanelWidth);
            }
            this.savePanelState();
        });

        window.onbeforeunload = () => {
            if (!this.hasChanges()) {
                return; }
            return 'pageOutConfirm';
        };

        $('#save-outer').on('click', (e) => {
            e.preventDefault();
            this.editorFrame.get(0).contentWindow.saveContent();
        })

        $('.modal-header select', this.editorPanel).on('change', (e) => {
            e.preventDefault();
            this.editorLocale = $(e.target).val();
            this.loadPages();
            this.loadMenu(this.getMenuID());
        });

        $('.modal-header .tb-collapse', this.editorPanel).on('click', (e) => {
            e.preventDefault();
            this.editorPanelCollapse.slideToggle(250, () => {
                this.savePanelState();
            });
            $('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
        });

        $('.modal-header .tb-toggle', this.editorPanel).on('click', (e) => {
            e.preventDefault();
            this.editorPanel.toggleClass('pinned');
            this.editorFrame.toggleClass('pinned');
            //this.editorPanelCollapse.slideToggle(250, () => {
            this.savePanelState();
            this.restorePanelState()
                //});
            //$('.modal-header .tb-toggle i').toggleClass('fa-unlock').toggleClass('fa-lock');
        });

        $('.modal-header .tb-collapse-right', this.editorPanel).on('click', (e) => {
            e.preventDefault();
            this.editorPanel.animate({ 'right': -this.editorPanelWidth }, () => {
                $('#editor-panel-left').show().animate({ right: 0 });
                this.savePanelState();
            });
            this.editorFrame.animate({ width: "100%" });
        });

        $('#editor-panel-left .tb-collapse-left').on('click', (e) => {
            e.preventDefault();
            $('#editor-panel-left').animate({ right: -53 } , () => {
                $('#editor-panel-left').hide();
                this.editorPanel.animate({ 'right': 0 });
                this.editorFrame.animate({ width: $(window).width() - this.editorPanelWidth });
                this.savePanelState();
            });          
            
            //$('#editor-panel-left').fadeOut();
            //$('.modal-header .tb-collapse i').toggleClass('fa-caret-right').toggleClass('fa-caret-left');
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
         *  Open new page dialog
         */
        $('#tab-pages', this.editorPanel).on('click', '.btn-create', (e) => {
            e.preventDefault();
            this.addPage();
        });

        /**
         *  Load page in window
         */
        $('#tab-pages', this.editorPanel).on('click', '.load', (e) => {
            e.preventDefault();
            let src = $(e.target).data('url');
            window.top.location.href = src;
        });

        /**
         *  Open edit page dialog
         */
        $('#tab-pages', this.editorPanel).on('click', '.settings', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.page_id = parent.data('id');
            this.editPage();
        });

        /**
         *  Duplicate a page
         */
        $('#tab-pages', this.editorPanel).on('click', '.duplicate', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            let page_id = parent.data('id');
            this.showLoadingIndicator();
            $.ajax({
                type: 'POST',
                url: '/admin/page/duplicate',
                data: 'id=' + page_id,
                error: (xhr, ajaxOptions, thrownError) => {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done((data) => {
                this.data = data;
                this.loadPageURL();
            });
        });

        /**
         *  Delete a page
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
                    url: '/admin/page/' + page_id,
                    data: {
                        '_method': 'delete'
                    },
                    dataType: 'json',
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
         *  Open new menu dialog
         */
        $('#tab-menus', this.editorPanel).on('click', '.btn-create', (e) => {
            e.preventDefault();
            //let menu_type_id = $('#menuSelector').find('option:selected').val();
            this.addMenu(this.getMenuID());
        });

        /**
         *  Load menu in window
         */
        $('#tab-menus', this.editorPanel).on('click', '.load', (e) => {
            e.preventDefault();
            let src = $(e.target).data('url');
            let target = $(e.target).data('target');
            if (target == '') {
                window.top.location.href = src;
            } else {
                window.open(src);
            }
        });


        /**
         *  Open edit menu dialog
         */
        $('#tab-menus', this.editorPanel).on('click', '.edit', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.menu_type_id = parent.data('id');
            this.editMenu();
        });


        /**
         *  Toggle menu active state
         */
        $('#tab-menus', this.editorPanel).on('click', '.toggleActive', (e) => {
            e.preventDefault();
            this.showLoadingIndicator();
            let menu_type_id = $(e.target).parents('.dd-item').data('id');
            let active = $(e.target).data('active');
            $.ajax({
                type: 'POST',
                url: '/admin/menu/active',
                data: 'id=' + menu_type_id + '&active=' + active,
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
         *  Delete a menu
         */
        $('#tab-menus', this.editorPanel).on('click', '.delete', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            let menu_type_id = parent.data('id');

            let message = 'Are you sure you want to delete menu item?';

            this.showConfirmationDialog(message, () => {
                this.showLoadingIndicator();
                $.ajax({
                    type: 'POST',
                    url: '/admin/menu/' + menu_type_id,
                    data: {
                        '_method': 'delete'
                    },
                    dataType: 'json',
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
         *  Select a menu
         */
        $('#menuSelector', this.editorPanel).on('change', (e) => {
            //let menu_type_id = $('#menuSelector').find('option:selected').val();
            this.loadMenu(this.getMenuID());
        });

        /**
         *  Menu item type form select
         */
        $('body').on('change', '#menuTypeSelector', (e) => {
            this.renderMenuTypeSelect();
        });


        /**
         *  Open edit collection dialog
         */
        $('#tab-collections', this.editorPanel).on('click', '.openCollection', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.collection = parent.data('collection');
            this.editCollection(this.collection);
        });

        /**
         *  Tab collections tab1
         *  Load collection in iframe
         */

        $('body').on('click', '#collection-tab1 .btn-create', (e) => {
            e.preventDefault();
            this.addCollectionItem();
        });

        /**
         *  Tab collections tab1
         *  Load collection in iframe
         */
        $('body').on('click', '#collectionItems .load', (e) => {
            e.preventDefault();
            let src = $(e.target).data('url');
            //this.editorFrame = src;
            // this.editorFrame.attr('src',src);
            window.top.location.href = src;
        });

        $('body').on('click', '#collectionItems .edit', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.collection_id = parent.data('id');
            this.editCollectionItem();
        });

        $('body').on('click', '#collectionItems .delete', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.collection_id = parent.data('id');

            let message = 'Are you sure you want to delete this item?';

            this.showConfirmationDialog(message, () => {
                this.showLoadingIndicator();
                $.ajax({
                    type: 'POST',
                    url: '/admin/blog/' + this.collection_id,
                    data: {
                        '_method': 'delete'
                    },
                    dataType: 'json',
                    error: (xhr, ajaxOptions, thrownError) => {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                }).done(() => {
                    this.loadCollectionItems();
                    $('#collection-tab1-left').html('');
                    // parent.slideUp(() => {
                    //     parent.remove();
                    //     this.hideLoadingIndicator();
                    // });
                });
            });
        });

        $('body').on('click', 'button.submit', (e) => {
            e.preventDefault();
            let form = $(e.target).parents('form');
            this.submitCollectionForm(form);
        });

        // collection pagination
        $('body').on('click', '#collection-edit .pagination a', (e) => {
            e.preventDefault();
            this.showLoadingIndicator();
            let href = $(e.target).attr('href');
            $.ajax({
                type: 'GET',
                url: href,
                error: (xhr, ajaxOptions, thrownError) => {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done((html) => {
                $('#collectionItemsOuter').html(html)
                this.hideLoadingIndicator();
            });
        });

        /**
         *  Open edit page dialog
         */
        $('#tab-settings', this.editorPanel).on('click', '.openSettings', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.setting = parent.data('setting');
            this.editSetting(this.setting);
        });

        /**
         *  Tab settings logs
         *  Load collection in iframe
         */
        $('#tab-settings', this.editorPanel).on('click', '.openLogs', (e) => {
            e.preventDefault();
            let parent = $(e.target).parents('.dd-item');
            this.setting = parent.data('setting');
            //console.log(this.setting)
            this.editSetting(this.setting);
        });

    }

    /**
    /* init Menu Nestable
    */
    initNestable(ele) {
        ele.nestable({
            maxDepth: 2
        }).on('change', () => {
            this.showLoadingIndicator();
            $.ajax({
                type: 'POST',
                url: '/admin/menu/sortorder',
                data: JSON.stringify(ele.nestable('asNestedSet')),
                contentType: "json",
                error: (xhr, ajaxOptions, thrownError) => {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            }).done(() => {
                this.hideLoadingIndicator();
            });
        });
    }

    /**
     *  Editor edit collection window
     */
    editCollection() {
        this.openDialog({
            id: 'collection-edit',
            title: 'Edit',
            modal: true,
            width: 800,
            minHeight: 600,
            url: '/admin/' + this.collection + '/collectionIndex',
            type: 'ajax',
            onAfterShow: () => {
                this.loadCollectionItems();
            },
            // callback: () => {
            // //     //this.loadPages();
            // //     // alert('yo');
            // //this.loadCollectionItems(collection);
            // },
            buttons: {
                //     ok: 'Save',
                //     Cancel: () => {
                //         this.dialog.dialog("close");
                //     }
            }
        });
    };

    /**
     *  Editor load all collection items
     */
    loadCollectionItems() {
        this.showLoadingIndicator();
        $.ajax({
            type: 'GET',
            url: '/admin/' + this.collection + '/listCollectionItems',
            //data: 'id='+menu_type_id,
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done((html) => {
            $('#collectionItemsOuter').html(html)
            this.hideLoadingIndicator();
        });
    }

    /**
     *  Editor add collection item
     */
    addCollectionItem() {
        this.showLoadingIndicator();
        $.ajax({
            type: 'GET',
            url: '/' + this.editorLocale + '/admin/' + this.collection + '/create',
            //data: 'id='+menu_type_id,
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done((html) => {
            $('#collection-tab1-left').html(html)
            $('#collection-tab1-left .tabs').tabs();
            this.hideLoadingIndicator();
        });
    };

    /**
     *  Editor edit collection window
     */
    editCollectionItem() {
        this.showLoadingIndicator();
        $.ajax({
            type: 'GET',
            url: '/' + this.editorLocale + '/admin/' + this.collection + '/' + this.collection_id + '/settings',
            //data: 'id='+menu_type_id,
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done((html) => {
            $('#collection-tab1-left').html(html)
            $('#collection-tab1-left .tabs').tabs();
            this.hideLoadingIndicator();
        });
    };

    submitCollectionForm(form) {
        // if (options.type == 'ajax') {
        this.showLoadingIndicator();
        //let form = $('#collection-edit form:visible');
        let formData = form.serialize();
        let action = form.attr('action');
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: action, // the url where we want to POST
            data: formData, // our data object
            dataType: 'json', // what type of data do we expect back from the server
            encode: true,
            error: (data) => {
                this.hideLoadingIndicator();
                $("input").parent().removeClass('has-error');
                $("input").prev().find('span').remove();
                let errors = data.responseJSON;
                console.log(errors);
                $.each(errors, (key, value) => {
                    $("input[name=" + key + "]").parent().addClass('has-error');
                    $("input[name=" + key + "]").prev().append(' <span class="has-error">' + value + '</span>');
                })
            }
        }).done((data) => {
            //this.hideLoadingIndicator();
            //console.log(data)
            if (data == true) {
                this.hideLoadingIndicator();
            } else {
                this.collection_id = data.id;
                this.loadCollectionItems(this.collection);
                this.editCollectionItem();
            }

            //this.data = data;
            //dialog.dialog('close');
            //dialog.remove();
            // if (typeof(options.callback) === 'function') {
            //     options.callback();
            // }

        });
        // } else {
        //     form.submit()
        // }
    }

    /**
     *  Editor edit page window
     */
    editSetting(setting) {
        this.openDialog({
            id: 'setting-edit',
            title: 'Edit',
            modal: false,
            width: 800,
            url: '/admin/' + setting,
            type: 'ajax',
            // callback: () => {
            //     this.loadPages();
            // },
            buttons: {
                //     ok: 'Save',
                //     Cancel: () => {
                //         this.dialog.dialog("close");
                //     }
            }
        });
    };

    /**
     * Menu Popup create edit
     * Render selection
     */
    renderMenuTypeSelect() {
        let dropdown = $('#menuTypeItemSelector');
        if (dropdown.length) {
            let external = $('#menuTypeExternalInput');
            let selected = $('#menuTypeSelector').find('option:selected').val();
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
                    error: (xhr, ajaxOptions, thrownError) => {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                }).done((data) => {
                    dropdown.empty();
                    //ele.append('<option value="0">-- Auswahl --</option>');
                    let selected = 0;
                    if ($('#morpher_id_orig').length) {
                        selected = $('#morpher_id_orig').text();
                    }
                    for (var i = 0; i < data.length; i++) {
                        let sel = '';
                        if (data[i].id == selected) {
                            sel = ' selected="selected"';
                        }
                        dropdown.append('<option value="' + data[i].id + '"' + sel + '>' + data[i].title + '</option>');
                    }
                });
            }
        }
    }

    /**
     *  Editor load all pages
     */
    loadPages() {
        this.showLoadingIndicator();
        $.ajax({
            type: 'GET',
            url: '/admin/page/listPages/' + this.editorLocale,
            //data: 'id='+menu_type_id,
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
     *  Editor edit page window
     */
    editPage() {
        this.openDialog({
            id: 'page-edit',
            title: 'Edit',
            modal: true,
            url: '/' + this.editorLocale + '/admin/page/' + this.page_id + '/settings',
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
            modal: true,
            url: '/admin/page/create',
            type: 'ajax',
            buttons: {
                ok: 'Create',
                Cancel: () => {
                    this.dialog.dialog("close");
                }
            },
            callback: () => {
                this.loadPageURL();
            },
        });
    };

    loadPageURL() {
        window.top.location.href = '/page/' + this.data.slug;
    }


    /**
     * save Editor State
     */
    savePanelState() {
        let activeLanguage = this.editorLocale;
        let activeTab = $('#tabs').tabs("option", "active");
        let activeMenu = $('#menuSelector', this.editorPanel).val();
        localStorage.setItem("editor-panel", JSON.stringify({
            pinned: this.editorPanel.hasClass('pinned'),
            position: this.editorPanel.position(),
            locale: activeLanguage,
            tab: activeTab,
            menu: activeMenu,
            expanded: $('#modal-toggle:visible', this.editorPanel).length,
            hidden: $('#editor-panel-left:visible').length
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
                pinned: true,
                position: { left: 50, top: 150 },
                locale: this.editorLocale,
                tab: 0,
                menu: 1,
                expanded: true,
                hidden: false
            };
        } else {
            panelState = JSON.parse(localStorage.getItem("editor-panel"))
        }
        if (!panelState.pinned) {
            this.editorPinned = false;
            $('.modal-header .tb-toggle i').removeClass('fa-lock').addClass('fa-unlock');
            $('.modal-header .tb-collapse-right').hide();
            $('.modal-header .tb-collapse').show();
            this.editorFrame.animate({
                width: '100%'
            }, 500);
            this.editorPanel.css('right', 'auto').css(panelState.position).draggable('enable')
            if (!panelState.expanded) {
                this.editorPanelCollapse.hide();
                $('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
            }
        } else {
            // this.editorFrame.addClass('pinned');
            this.editorPinned = true;
            this.editorPanel.addClass('pinned');
            $('.modal-header .tb-toggle i').addClass('fa-lock').removeClass('fa-unlock');
            $('.modal-header .tb-collapse-right').show();
            $('.modal-header .tb-collapse').hide();
            if (panelState.hidden) {
                this.editorPanel.css('right', -this.editorPanelWidth ).css('left', 'auto').css('top', 0).draggable('disable');
                $('#editor-panel-left').show().css('right', 0 );
                this.editorFrame.width('100%');
            } else {
                this.editorFrame.animate({ width: $(window).width() - this.editorPanelWidth });
                this.editorPanel.css('right', 0).css('left', 'auto').css('top', 0).draggable('disable');
            }
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
    getMenuID() {
        return $('#menuSelector').find('option:selected').val();
    }

    /**
     *  Editor load selected menu
     */
    loadMenu(menu_type_id) {
        this.showLoadingIndicator();
        $.ajax({
            type: 'GET',
            url: '/admin/menu/listMenus/' + menu_type_id + '/' + this.editorLocale,
            //data: 'id='+menu_type_id,
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr.status);
                console.log(thrownError);
            }
        }).done((html) => {
            $('#menuItems').html(html)
                // $('#menuItems').parent().nestable('init');
            this.initNestable($('#menuItems').parent());
            //$('#menuItems').parent().nestable('collapseAll');
            this.savePanelState();
            this.hideLoadingIndicator();
        });
    }


    /**
     *  Editor edit menu window
     */
    editMenu() {

        this.openDialog({
            id: 'menu-edit',
            title: 'Edit',
            modal: true,
            url: '/admin/menu/' + this.menu_type_id + '/settings' + '/' + this.editorLocale,
            type: 'ajax',
            onAfterShow: () => {
                this.renderMenuTypeSelect();
            },
            callback: () => {
                this.loadMenu(this.getMenuID());
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


    /**
     *  Editor new menu window
     */
    addMenu(menu_type_id) {

        this.openDialog({
            id: 'menu-add',
            title: 'Create a new menu',
            modal: true,
            url: '/' + this.editorLocale + '/admin/menu/create/' + menu_type_id,
            type: 'ajax',
            onAfterShow: () => {
                this.renderMenuTypeSelect();
            },
            callback: () => {
                this.loadMenu(menu_type_id);
            },
            buttons: {
                ok: 'Create',
                Cancel: () => {
                    this.dialog.dialog("close");
                }
            }
        });
    };


    /**
     * Global Modal open window
     */
    openDialog(options) {

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

                if (typeof(options.onCreate) === 'function') {
                    options.onCreate(formDom);
                }

                $('body').append(formDom);
                this.showDialog(options);
            });
    }



    showDialog(options) {
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
        //     {
        //       "type": "text",
        //       "title": "Test",
        //       "isMandatory": false
        //     }
        //   ]};


        var buttons = {};

        if (typeof(options.buttons.ok) !== 'undefined') {
            buttons[options.buttons.ok] = () => {
                this.submitForm(dialog, form, options);
            };
        }
        // buttons['Close'] = () => {
        //     dialog.dialog('close');
        //     dialog.remove();
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

    submitForm(dialog, form, options) {
        if (typeof(options.onSubmit) === 'function') {
            //console.log(options)
            options.onSubmit(options, form);
            dialog.dialog('close');
        } else if (options.type == 'ajax') {
            var formData = form.serialize();
            let action = form.attr('action');
            $.ajax({
                type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                url: action, // the url where we want to POST
                data: formData, // our data object
                dataType: 'json', // what type of data do we expect back from the server
                encode: true,
                error: (data) => {
                    $("input").parent().removeClass('has-error');
                    $("input").prev().find('span').remove();
                    let errors = data.responseJSON;
                    console.log(errors);
                    $.each(errors, (key, value) => {
                        $("input[name=" + key + "]").parent().addClass('has-error');
                        $("input[name=" + key + "]").prev().append(' <span class="has-error">' + value + '</span>');
                    })
                }
            }).done((data) => {
                this.data = data;
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

    showMessageDialog(message, title) {

        var messageHtml = message;

        if (typeof(message) === 'object') {
            messageHtml = $('<ul></ul>').addClass('messages-list');
            for (var i in message) {
                var itemDom = $('<li></li>').html(message[i]);
                messageHtml.append(itemDom);
            }
        }

        var buttons = {};

        buttons["ok"] = function() {
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

    showPromptDialog(message, title, onSubmit, defaultValue) {

        var form = $('<div/>').addClass('message-prompt inlinecms');
        var prompt = $('<div/>').addClass('prompt').html(message);
        var input = $('<input/>').attr('type', 'text').val(defaultValue);

        var buttons = {};

        buttons['ok'] = function() {
            onSubmit(input.val());
            $(this).dialog('close');
        };

        buttons['cancel'] = function() {
            $(this).dialog('close');
        };

        form.append(prompt).append(input).dialog({
            title: title,
            modal: true,
            resizable: false,
            width: 350,
            buttons: buttons,
            open: function() {
                setTimeout(function() {
                    input.focus();
                }, 10);
            }
        });
    };

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

    //     // alert(JSON.stringify(this.editorFrame.get(0).contentWindow.options));
    //     console.log(elementId)
    //     return '{"size": "60" }';
    //     $.ajax({
    //             type: 'GET', // define the type of HTTP verb we want to use (POST for our form)
    //             url: '/admin/element/'+elementId, // the url where we want to POST
    //             dataType: 'json', // what type of data do we expect back from the server
    //             encode: true,
    //             error: (data) => {

    //                 }
    //         }).done((data) => {
    //             return '{"size": 60 }';
    //         });

    //     // var widget = this.getWidget(regionId, widgetId);
    //     // return widget.options;
    //     //return '{"size":"60"}';
    //     //
    //     // return {"email_type": "default",
    //     //   "email": "",
    //     //   "subject": "",
    //     //   "thanks_msg": "",
    //     //   "submit": "fsdfsfd",
    //     //   "style": "s-horizontal",
    //     //   "fields": [
    //     //     {
    //     //       "type": "text",
    //     //       "title": "Test",
    //     //       "isMandatory": false
    //     //     }
    //     //   ]};

    // };

    /**
     * Registers all Elements
     */
    registerElementHandler(id, handler) {

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
    buildElementsList() {

        let elementsList = $('#tab-elements .list ul', this.editorPanel);

        for (let i in this.elementsList) {
            let elementId = this.elementsList[i];

            let title = this.elementHandlers[elementId].getTitle();
            let icon = this.elementHandlers[elementId].getIcon();

            let item = $('<li></li>').attr('data-id', elementId).addClass('editor-element');
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
    initElements(region) {
        region.find('>div').each((i, elm) => {

            let elementDom = $(elm);

            let type = elementDom.data('type');
            let handler = this.elementHandlers[type];

            handler.initElement(elementDom, (elementDom, type) => {
                this.buildElementToolbar(elementDom, handler);
            });
        });
    };

    /**
     * Build elements Toolbar
     */
    buildElementToolbar(elementDom, handler) {

        if (typeof(handler.toolbarButtons) === 'undefined') {

            var defaultToolbarButtons = {
                "options": {
                    icon: "fa-wrench",
                    title: 'Options'
                },
                "move": {
                    icon: "fa-arrows",
                    title: 'Move',
                    click: (elementDom) => {
                        return false;
                    }
                },
                "delete": {
                    icon: "fa-trash",
                    title: 'Delete',
                    click: (elementDom) => {
                        this.deleteElement(elementDom);
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
                return button;
            }
            if (buttonId == 'move' && isFixedRegion) {
                return button;
            }
            if (buttonId == 'delete' && isFixedRegion) {
                return button;
            }

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
    initRegions() {
        $('.jodelRegion', this.editorFrame.contents()).each((i, elm) => {
            let region = $(elm);
            this.initElements(region);

            var dropZone = $('<div></div>').addClass('drop-helper').addClass('jodelcms');
            dropZone.html('<i class="fa fa-plus-circle"></i>');

            region.append(dropZone);

            $('.drop-helper', region).hide();

            if (region.hasClass('jodelcms-region-fixed')) {
                return;
            }

            region.droppable({
                accept: ".editor-element",
                over: () => {
                    $('.drop-helper', region).show();
                },
                out: () => {
                    $('.drop-helper', region).hide();
                },
                drop: (event, ui) => {
                    $('.drop-helper', region).hide();
                    this.addElement(region, ui.draggable.data('id'));
                }
            });

            region.sortable({
                handle: '.b-move',
                //axis: 'y',
                connectWith: '.jodelRegion',
                update: (event, ui) => {
                    this.setChanges();
                }
            });
        });
    };


    addElement(regionDom, type) {
        //alert(type)
        let regionId = regionDom.data('region-id');
        let elementOrder = regionDom.find('>div').length - 1;
        let totalElements = this.editorFrame.contents().find('div.jodelcms-element').length;
        let dummyID = Number(totalElements) + 1;

        let handler = this.elementHandlers[type];
        let options = handler.defaultOptions;

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: '/admin/element/add', // the url where we want to POST
            data: { 'id': regionId, 'dummyID': dummyID, 'type': type, 'options': JSON.stringify(options), 'order': elementOrder }, // our data object
            //dataType: 'json', // what type of data do we expect back from the server
            encode: true,
            error: (data) => {}
        }).done((data) => {
            let elementDom = $(data);
            $('.drop-helper', regionDom).before(elementDom);

            handler.createElement(regionId, elementDom, (elementDom, type) => {
                this.buildElementToolbar(elementDom, handler);
                return true;
            });
            this.setChanges();
        });
    };

    /**
     * Delete an Element
     */
    deleteElement(elementDom) {

        let elementId = elementDom.attr('id');
        let eid = elementId.replace('element_', '');
        let type = elementDom.data('type');
        let handler = this.elementHandlers[type];

        this.showConfirmationDialog('Delete this Element', () => {

            if (!elementDom.hasClass('dummy')) {
                this.elementsToDelete.push(eid);
            }
            if (typeof(handler.deleteElement) === 'function') {
                handler.deleteElement(elementDom);
            } else {
                elementDom.remove();
            }
            this.setChanges();
        });
    };

}


var editor = new Editor();

$(function() {
    editor.initPanel();
});
