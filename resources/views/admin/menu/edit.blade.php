{!! Form::model($menu,[
        'method' => 'PATCH',
        //'route' => ['admin.menu.update', $menu->id],
        'url' => ['/'.config('app.locale').'/admin/menu/'.$menu->id],
        'id' => 'updateMenu'
    ]) !!}

    @include('admin/menu/form')

{!! Form::close() !!}