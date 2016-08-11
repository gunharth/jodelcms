<?php

namespace App\Http\Controllers;

use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Illuminate\Http\Request;
use App\PostTranslation;
use App\Http\Requests;
use App\Post;
use Auth;

class PostsController extends Controller
{
    
    use Traits;

    private $locale;
    
    public function __construct()
    {
        $this->middleware('auth', ['except' =>['show', 'index'] ]);
        $this->locale = LaravelLocalization::getCurrentLocale();
    }

    /**
     * Display main index resource
     * If logged in redirect to iframe calling @indexEditor
     * route: /
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = Post::where('id', '>', 1)->paginate(10);
        if (Auth::check()) {
            $src = '/' . $this->locale . '/admin/blog/indexEditor';
            return $this->loadiFrame($src);
        }
        $post = Post::findOrFail(1); // get blog home and settings?
        return view('blog.index', compact('post','posts'));
    }

    
    public function indexEditor()
    {
        $post = Post::findOrFail(1); // get blog home and settings?
        $posts = Post::where('id', '>', 1)->paginate(10);
        return view('blog.index', compact('post','posts'));
    }

    // public function adminIndex()
    // {
    //     $posts = Post::where('id', '>', 1)->paginate(10);
    //     return view('admin.blog.index', compact('posts'));
    // }

    /**
     * Display a specified resource
     * If logged in redirect to iframe calling @edit
     * route: resource/{slug}
     * @param  string $slug,  $translations
     * @return \Illuminate\Http\Response
     */
    public function show($slug, PostTranslation $translations)
    {
        $translation = $translations->getBySlug($slug);
        if (! $translation) {
            return App::abort(404);
        }
        $post = $translation->post;
        

        if (Auth::check()) {
            $src = '/' . $this->locale . '/admin/blog/'.$post->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view('blog.show', compact('post'));

        //return view('blog.show', compact('post'));
    }

    public function showID($id)
    {
        if ($id == 1) {
            $posts = Post::where('id', '>', 1)->paginate(10);
            if (Auth::check()) {
                $src = '/blog/indexEditor';
                return $this->loadiFrame($src);
            }
            return view('blog.index', compact('posts'));
        }
        $post = Post::find($id);
        if (Auth::check()) {
            $src = '/blog/'.$post->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view('blog.show', compact('post'));
    }


    /**
     * iframe content to edit resource
     * @param  $request, $slug, $translations
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $slug, PostTranslation $translations)
    {
        $translation = $translations->getBySlug($slug);
        $post = $translation->post;
        // if ($post->template->id == 1) {
        //     return view('index', compact('post'));
        // }
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
