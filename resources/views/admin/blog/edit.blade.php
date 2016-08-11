{!! Form::model($post,[
        'method' => 'PATCH',
        'url' => ['/'.config('app.locale').'/admin/blog/'.$post->id],
        'id' => 'updatePost'
    ]) !!}

    @include('admin/blog/form')

{!! Form::close() !!}