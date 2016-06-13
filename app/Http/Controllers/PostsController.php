<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Post;
use Auth;

class PostsController extends Controller
{
    
	public function __construct()
    {
        $this->middleware('auth', ['except' =>['show','index'] ]);
    }


    public function index()
    {
    	$posts = Post::where('id', '>', 1)->paginate(1);
    	if (Auth::check()) {
    		$src = '/blog/indexEditor';
            return $this->loadiFrame($src);
        }
    	return view('blog.index', compact('posts'));
    }


    public function indexEditor()
    {
        $posts = Post::where('id', '>', 1)->paginate(1);
    	return view('blog.index', compact('posts'));
    }


    public function show(Post $post)
    {
    	if (Auth::check()) {
    		$src = '/blog/'.$post->slug.'/edit';
            return $this->loadiFrame($src);
        }
    	return view('blog.show', compact('post'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post)
    {
        return view('blog.show', compact('post'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        //$data = ;
        $post->fill($request->all())->save();
        return $post;
    }

    public function loadiFrame($src)
    {
        return view('editor', compact('src'));
    }
}
