{!! Form::open([
        'route' => ['admin.menu.store'],
        'id' => 'createMenu'
    ]) !!}
	{!! Form::hidden('menu_type_id',$id) !!}

    @include('admin/menu/form')

{!! Form::close() !!}