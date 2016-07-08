<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Post;
use Auth;

class PostsController extends Controller
{
    
    use Traits;
    
    public function __construct()
    {
        $this->middleware('auth', ['except' =>['show', 'index'] ]);
    }


    public function index()
    {
        $posts = Post::where('id', '>', 1)->paginate(10);
        if (Auth::check()) {
            $src = '/blog/indexEditor';
            return $this->loadiFrame($src);
        }
        return view('templates.blog.index', compact('posts'));
    }


    public function indexEditor()
    {
        $post = Post::findOrFail(1); // get blog home and settings?
        $posts = Post::where('id', '>', 1)->paginate(10);
        return view('templates.blog.index', compact('post','posts'));
    }

    public function adminIndex()
    {
        $posts = Post::where('id', '>', 1)->paginate(10);
        return view('admin.blog.index', compact('posts'));
    }


    public function show(Post $post)
    {
        if (Auth::check()) {
            $src = '/blog/'.$post->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view('templates.blog.show', compact('post'));
    }

    public function showID($id)
    {
        if ($id == 1) {
            $posts = Post::where('id', '>', 1)->paginate(10);
            if (Auth::check()) {
                $src = '/blog/indexEditor';
                return $this->loadiFrame($src);
            }
            return view('templates.blog.index', compact('posts'));
        }
        $post = Post::find($id);
        if (Auth::check()) {
            $src = '/blog/'.$post->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view('templates.blog.show', compact('post'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post)
    {
        return view('templates.blog.show', compact('post'));
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

    public function updateContent(Request $request, Post $post)
    {
        $post->fill($request->all())->save();
        return $post;
    }

    // public function loadiFrame($src)
    // {
    //     return view('editor', compact('src'));
    // }
}
