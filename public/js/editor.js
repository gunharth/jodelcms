"use strict";
	class Editor {

		constructor() {
			this.editorPanel = $('#editor-panel');
			this.editorPanelCollapse = $('#modal-toggle');
			this.formsLoaded = {};

		}
	
		initPanel() {
			$.ajaxSetup({
		        headers: {
		            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		        }
			});

			this.editorPanel.draggable({
	            handle: ".modal-header",
	            iframeFix: true,
	            cursor: "move",
	            containment: "document",
	            stop: ()=> {
	            	this.savePanelState();
	            	this.editorPanel.css({height: 'auto'});
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
				    if(newLeft < 0) { newLeft = 0;}
				    $("#editor-panel").css({ left: newLeft });
				}
				if (windowHeight < top + height) {                
				    let newTop = top - ((top + height) - windowHeight);
				    if(newTop < 0) { newTop = 0;}
				    $("#editor-panel").css({ top: newTop });
				}
				this.savePanelState();
			});

	        $('.modal-header .tb-collapse', this.editorPanel).on('click', (e)=>{
				e.preventDefault();
				this.editorPanelCollapse.slideToggle(250, ()=>{
	                this.savePanelState();
	            });
				$('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
	        });

			$( "#tabs" ).tabs({
				activate: ( event, ui ) => {
					this.savePanelState();
				},
				create:  ( event, ui ) => {
					//this.editorPanel.fadeIn(() => {
						this.restorePanelState();
					//});
					
				}
			});

			$( ".tabs" ).tabs({});
			
		    $('#tab-pages .btn-create', this.editorPanel).on('click', (e)=>{
	        	e.preventDefault();
	        	this.addPage();
			});

			$('#tab-menus .btn-create', this.editorPanel).on('click', (e)=>{
	        	e.preventDefault();
	        	this.addMenu();
			});

	    	$('.dd').nestable().on('change',function(){
                        $.ajax({
                            type: 'POST',
                            url: '/menue/sortorder',
                            data: JSON.stringify($('.dd').nestable('asNestedSet')),
                            contentType: "json",
                            /*headers: {
                                'X-CSRF-Token': $('meta[name="_token"]').attr('content')
                            },*/
                            error:  function (xhr, ajaxOptions, thrownError) {
                                console.log(xhr.status);
                                console.log(thrownError);
                            }
                        });
                    }
                );


		}

		savePanelState() {
	        let activeTab = $('#tabs').tabs( "option", "active" );

			localStorage.setItem("editor-panel", JSON.stringify({
				position: this.editorPanel.position(),
				tab: activeTab,
	            expanded: $('#modal-toggle:visible', this.editorPanel).length
			}));
		};

		restorePanelState() {
			this.editorPanel.fadeIn();
			let panelState = {};
			if (!localStorage.getItem("editor-panel")){
				panelState = {
					position: {left: 50, top: 150},
					tab: 0,
	                expanded: true
				};
			} else {
				panelState = JSON.parse(localStorage.getItem("editor-panel"))
			}
			this.editorPanel.css(panelState.position);
			$('#tabs').tabs( "option", "active", panelState.tab );
	        if (!panelState.expanded){
	            this.editorPanelCollapse.hide();
	            $('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
	        }
		};

		// ad page and prepare dialog details
		//openDialog
		//openform

		addPage() {
			this.openDialog({
				id: 'page-add',
	            title: 'Create a new Page',
	            url: '/admin/forms/page/create',
	            buttons: {
					ok: 'Create',
					Cancel: () => {
			          this.dialog.dialog( "close" );
			        }
				}
			});
		};

		addMenu() {
			this.openDialog({
				id: 'menu-add',
	            title: 'Create a new menu',
	            url: '/admin/forms/menu/create',
	            buttons: {
					ok: 'Create',
					Cancel: () => {
			          this.dialog.dialog( "close" );
			        }
				}
			});
		};

		openDialog(options) {
			var isFormDomLoaded = typeof(this.formsLoaded[options.id]) !== 'undefined';

			if (!isFormDomLoaded){
	            this.loadDialog(options);
				return;
			}
			this.showDialog(options);
		}

		loadDialog(options) {
			var formDom = $('<div></div>').attr('id', options.id);
			$.ajax({
				  url: options.url,
				})
			  	.done((html) => {
			      	formDom.hide().append(html);
					if (formDom.find('.tabs').length === 1){
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
			var dialog = $('#'+options.id);

			var buttons = {};

			buttons[options.buttons.ok] = ()=>{
				var form = $('form', dialog);
				form.submit()
				//$('#createPage').submit();
				//cms.submitForm(values, form, dialogDom, options);
			};
			buttons['Close'] = ()=>{
				$('#'+options.id).dialog('close');
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
	            /*open:function () {

	                $(this).closest('.ui-dialog').find(".ui-dialog-buttonset .ui-button:first").addClass("green");

	                if (typeof(options.onAfterShow) === 'function'){
	                    options.onAfterShow(form);
	                }

	            }*/
			});
		};

	}

	$(function () {

		let editor = new Editor();
		editor.initPanel();


	});