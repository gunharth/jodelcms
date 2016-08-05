<input type="hidden" name='locale' value="{{ config('app.locale') }}">
<div class="form-group">
    {!! Form::label('name','Menu Title') !!}
    {!! Form::text('name',null,['class' => 'form-control', 'placeholder' => 'Menu Title']) !!}
</div>
<div class="form-group">
    {!! Form::label('slug','Slug') !!}
    {!! Form::text('slug',null,['class' => 'form-control', 'placeholder' => 'slug']) !!}
</div>
@if (config('app.locale') == config('app.fallback_locale'))
<div class="form-group">
    {!! Form::label('morpher_type','Link to') !!}
    {!! Form::select(
        'morpher_type',
        Config::get('jodel.contentTypes'),
        $menu->morpher_type_simple,
        ['class' => 'form-control', 'id' => 'menuTypeSelector']
        )
    !!}
</div>
<div class="form-group">
    {!! Form::select(
        'morpher_id',
        [],
        '',
        ['class' => 'form-control', 'id' => 'menuTypeItemSelector']
        )
    !!}
</div>
<div class="form-group" id="menuTypeExternalInput" style="display: none;">
    {!! Form::text('external_link',null,['class' => 'form-control', 'placeholder' => 'http://', 'id' => 'external_link']) !!}
</div>
<div id="morpher_id_orig" style="display: none;">{{ $menu->morpher_id }}</div>
@endif