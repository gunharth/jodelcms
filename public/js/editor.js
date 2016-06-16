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
	        if ($('#editor-loading').length){
	            $('#editor-loading').show();
	            return;
	        }
	        var indicator = $('<div></div>').addClass('inlinecms-loading-indicator');
	        indicator.append('<i class="fa fa-spinner fa-pulse"></i>').show();
	        $('body').append(indicator);
	    };

	    hideLoadingIndicator(){
	        $('#editor-loading').hide();
	    };
	
		initPanel() {
			$.ajaxSetup({
		        headers: {
		            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		        }
			});

			//window.frames[0]
			this.editorFrame.load(() => {
			    $('a[target!=_blank]', this.editorFrame.contents()).attr('target', '_top');
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

			$('#tab-pages .edit', this.editorPanel).on('click', (e)=>{
	        	e.preventDefault();
	        	let parent = $(e.target).parents('.dd-item');
	        	this.page_id = parent.data('id');
	        	this.editPage();
			});

			


			$('#tab-pages', this.editorPanel).on('click', '.delete', (e)=>{
	        	e.preventDefault();
	        	let parent = $(e.target).parents('.dd-item');
	        	let page_id = parent.data('id');

	        	let message = 'Test';

	        	this.showConfirmationDialog(message, ()=>{
		        	this.showLoadingIndicator();
		        	$.ajax({
	                    type: 'POST',
	                    url: '/page/delete',
	                    data: 'id='+page_id,
	                    error: (xhr, ajaxOptions, thrownError) => {
	                        console.log(xhr.status);
	                        console.log(thrownError);
	                    }
	                }).done(()=>{
						  parent.slideUp( () => {
						  	parent.remove();
						  	this.hideLoadingIndicator();
						  });
					});
				});
			});




			
		


		

		    /**
		    /* Menu funtions
		    **/
		    $('.nestable').nestable({
		    	maxDepth: 3
		    	 }).on('change',() => {
                $.ajax({
                    type: 'POST',
                    url: '/menue/sortorder',
                    data: JSON.stringify($('.nestable').nestable('asNestedSet')),
                    contentType: "json",
                    /*headers: {
                        'X-CSRF-Token': $('meta[name="_token"]').attr('content')
                    },*/
                    error: (xhr, ajaxOptions, thrownError) => {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                });
            });

			$('#tab-menus .btn-create', this.editorPanel).on('click', (e)=>{
	        	e.preventDefault();
	        	let menu_id = $('#menuSelector').find('option:selected').val();
	        	this.addMenu(menu_id);
			});

	    	$('#tab-menus', this.editorPanel).on('click', '.toggleActive', (e)=>{
	        	e.preventDefault();
	        	let menu_id = $(e.target).parents('.dd-item').data('id');
	        	let active = $(e.target).data('active');
	        	$.ajax({
                    type: 'POST',
                    url: '/menue/active',
                    data: 'id='+menu_id+'&active='+active,
                    error:  function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                }).done(function() {
					  $(e.target).toggleClass( "fa-circle-o" ).toggleClass( "fa-circle" );
				});
			});

			$('#tab-menus', this.editorPanel).on('click', '.delete', (e)=>{
	        	e.preventDefault();
	        	let parent = $(e.target).parents('.dd-item');
	        	let menu_id = parent.data('id');
	        	$.ajax({
                    type: 'POST',
                    url: '/menue/delete',
                    data: 'id='+menu_id,
                    error: (xhr, ajaxOptions, thrownError) => {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                }).done(() => {
					  parent.slideUp( () => {
					  	parent.remove();
					  });
				});
			});

			$('#menuSelector', this.editorPanel).on('change', (e)=>{
				let menu_id = $('#menuSelector').find('option:selected').val();
				$.ajax({
                    type: 'GET',
                    url: '/admin/menu/listMenus/'+menu_id,
                    //data: 'id='+menu_id,
                    error: (xhr, ajaxOptions, thrownError) => {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                }).done((html) => {
					  $('#menuItems').html(html)
				});
			});
			


		}

		editPage() {
				this.openDialog({
					id: 'page-edit',
		            title: 'Edit',
		            url: '/page/'+this.page_id+'/settings',
		            type: 'ajax',
		            buttons: {
						ok: 'Save',
						Cancel: () => {
				          this.dialog.dialog( "close" );
				        }
					}
				});
			};

		addPage() {
			this.openDialog({
				id: 'page-add',
	            title: 'Create a new Page',
	            url: '/admin/forms/page/create',
	            type: '',
	            buttons: {
					ok: 'Create',
					Cancel: () => {
			          this.dialog.dialog( "close" );
			        }
				}
			});
		};


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

		

		addMenu(menu_id) {
			$('#menu-add').remove();
			delete this.formsLoaded['menu-add'];
			this.openDialog({
				id: 'menu-add',
	            title: 'Create a new menu',
	            url: '/admin/forms/menu/create/'+menu_id,
	            type: 'ajax',
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
				this.submitForm(dialog,form,options);
			};
			buttons['Close'] = ()=>{
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
	            /*open:function () {

	                $(this).closest('.ui-dialog').find(".ui-dialog-buttonset .ui-button:first").addClass("green");

	                if (typeof(options.onAfterShow) === 'function'){
	                    options.onAfterShow(form);
	                }

	            }*/
			});
		};

		submitForm(dialog,form,options) {
			if(options.type == 'ajax') {
				var formData = form.serialize();
				let action = form.attr('action');
		        $.ajax({
		            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
		            url         : action, // the url where we want to POST
		            data        : formData, // our data object
		            dataType    : 'json', // what type of data do we expect back from the server
		            encode          : true
		        }).done(function(data) {
		            	dialog.dialog('close');
		            	$('#tab-pages .dd-item[data-id='+data.id+'] .dd-title').text(data.title);

            });
		        } else {
		        	form.submit()
		        }
			

		}

		showConfirmationDialog(message, onConfirm, onCancel){

	        var buttons = {};

	        buttons["yes"] = function(){
	            if (typeof(onConfirm)==='function') { onConfirm(); }
	            $(this).dialog('close');
	        };

	        buttons["no"] = function(){
	            if (typeof(onCancel)==='function') { onCancel(); }
	            $(this).dialog('close');
	        };

			$('<div class="message-text inlinecms"></div>').append(message).dialog({
				title: "confirmation",
				modal: true,
				resizable: false,
	            width:350,
				buttons: buttons,
	            open:function () {
	                $(this).closest('.ui-dialog').find(".ui-dialog-buttonset .ui-button:first").addClass("green");
	                $(this).closest('.ui-dialog').find(".ui-dialog-buttonset .ui-button:last").addClass("red");
	            }
			});

		};


		

	}

	$(function () {

		let editor = new Editor();
		editor.initPanel();


	});