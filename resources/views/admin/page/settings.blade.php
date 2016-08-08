{!! Form::model($page,[
        'method' => 'PATCH',
        //'route' => ['admin.page.update', $page->slug],
        'url' => ['/'.config('app.locale').'/admin/page/'.$page->id],
        'id' => 'updatePage'
    ]) !!}
	
    @include('admin/page/form')

{!! Form::close() !!}