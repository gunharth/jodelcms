{!! Form::open([
        'route' => ['admin.menu.store'],
        'id' => 'createMenu'
    ]) !!}
	{!! Form::hidden('menu_id',$id) !!}

    @include('admin/menu/form')

{!! Form::close() !!}