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
                        <option value="default">Mailgun</option>
                        <option value="custom">formEmailCustom</option>
                    </select>
                </div>

                <div class="form-group f-email">
                    <label for="email">E-Mail:</label>
                    <input type="text" name="email">
                </div>

                <div class="form-group">
                    {!! Form::label('subject','E-Mail Subject') !!}
                    {!! Form::text('subject',null,['class' => 'form-control subject', 'placeholder' => 'E-Mail Subject']) !!}
                </div>

                <div class="form-group">
                    {!! Form::label('submit','Submit Button') !!}
                    {!! Form::text('submit',null,['class' => 'form-control submit', 'placeholder' => 'Submit']) !!}
                </div>

                <div class="form-group">
                    {!! Form::label('response','Response Message after Submission') !!}
                    {!! Form::textarea('response',null,['class' => 'form-control response', 'rows' => 3, 'placeholder' => 'Thank you!']) !!}
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
