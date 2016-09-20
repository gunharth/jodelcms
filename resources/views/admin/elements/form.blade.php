<form id="inlinecms-form-form-options" action="" method="post" class="form">

    <div class="tabs">

        <ul>
            <li><a href="#tab-form-fields">Fields</a></li>
            <li><a href="#tab-form-settings">Settings</a></li>
        </ul>

        <div id="tab-form-fields">

            <fieldset>

                <div class="field">
                    <div class="fields-list">
                        
                        <div class="field-template">
                            <span class="drag-handle"><i class="fa fa-arrows"></i></span>
                            <input type="text" class="field-title" placeholder="Field Label">
                            <select class="field-type">
                                <option value="text">Text</option>
                                <option value="textarea">Textarea</option>
                                <option value="email">Email</option>
                                <option value="checkbox">Checkbox</option>
                            </select>
                            <span class="actions">
                                <a href="#" class="b-mandatory" title="formFieldMandatorySet">
                                    <i class="fa fa-asterisk"></i>
                                </a>
                                <a href="#" class="b-delete"><i class="fa fa-times"></i></a>
                            </span>
                        </div>

                    </div>
                </div>

                <div class="field f-add">
                    <button class="button">
                        <i class="fa fa-plus"></i> Add field
                    </button>
                </div>

            </fieldset>

        </div>

        <div id="tab-form-settings">

            <fieldset>

                <div class="form-group f-email-type">
                    <label for="email_type">Recipient:</label>
                    <select name="email_type">
                        <option value="default"></option>
                        <!-- <option value="custom">formEmailCustom</option> -->
                    </select>
                </div>

                <div class="field f-email">
                    <label for="email">E-Mail:</label>
                    <input type="text" name="email">
                </div>

                <div class="form-group">
                {!! Form::label('subject','E-Mail Subject') !!}
                {!! Form::text('subject',null,['class' => 'form-control', 'placeholder' => 'E-Mail Subject']) !!}
                </div>

                <div class="field f-thanks-msg">
                    <label for="thanks_msg">Thank you Mesage:</label>
                    <textarea name="thanks_msg"></textarea>
                </div>

                <div class="field">
                    <label for="submit">Subit Button:</label>
                    <input type="text" name="submit">
                </div>

                <div class="field">
                    <label for="style">formLabelsAlign:</label>
                    <select name="style">
                        <option value="s-vertical">formLabelsAlignVert</option>
                        <option value="s-horizontal">formLabelsAlignHor</option>
                    </select>
                </div>

            </fieldset>

        </div>

    </div>

    <style>
        #inlinecms-form-form-options .fields-list .field-template { display:none; }
        #inlinecms-form-form-options .fields-list .form-field { height:35px; line-height: 35px; }
        #inlinecms-form-form-options .fields-list .form-field input { width:230px; }
        #inlinecms-form-form-options .fields-list .form-field select { width:100px; margin-right: 10px; }
        #inlinecms-form-form-options .fields-list .form-field i { font-size:15px; }
        #inlinecms-form-form-options .fields-list .form-field .actions a { color:#bdc3c7; display:inline-block; width:16px; }
        #inlinecms-form-form-options .fields-list .form-field .actions a:hover { color:#7f8c8d; }
        #inlinecms-form-form-options .fields-list .form-field .actions .b-mandatory.active { color:#e74c3c; }
    </style>

</form>
