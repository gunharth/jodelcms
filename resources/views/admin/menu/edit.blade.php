
{!! Form::model($menu,[
        'method' => 'PATCH',
        'route' => ['admin.menu.update', $menu->id],
        'id' => 'updateMenu'
    ]) !!}

    @include('admin/menu/form')

{!! Form::close() !!}