<?php

namespace App\Http\Controllers;

use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use App\Http\Requests\PostRequest;
use Illuminate\Http\Request;
use App\PostTranslation;
use App\Http\Requests;
use App\Template;
use App\Post;
use Auth;
use App;

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
            $src = '/' . $this->locale . '/admin/blog/editIndex';
            return $this->loadiFrame($src);
        }
        $post = Post::findOrFail(1); // get blog home and settings?
        return view('blog.index', compact('post', 'posts'));
    }

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
    }

    /**
     * Display a specified resource from linked menu.
     * If logged in redirect to iframe calling @admin.edit
     * route: menu {slug}
     * @param  int $pageid, string $menuslug
     * @return \Illuminate\Http\Response
     */
    public function showID($id, $slug)
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
            $src = '/' . $this->locale . '/admin/blog/'.$post->slug.'/edit';
            if ($this->locale != config('app.fallback_locale')) {
                $slug = $this->locale . '/' . $slug;
            }
            return $this->loadiFrame($src, $slug);
        }
        return view('blog.show', compact('post'));
    }

    /**
     * iframe content to edit index resource
     * @param  $request, $slug, $translations
     * @return \Illuminate\Http\Response
     */
    public function editIndex()
    {
        $post = Post::findOrFail(1); // get blog home and settings?
        $posts = Post::where('id', '>', 1)->paginate(10);
        return view('blog.index', compact('post', 'posts'));
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
        return view('blog.show', compact('post'));
    }

    /**
     * Update content areas of specified resource
     * ajax route: @admin updateContent
     * @param  int $resourceid, string $menuslug
     * @return \Illuminate\Http\Response
     */
    public function updateContent(Request $request, $slug, PostTranslation $translations)
    {
        if ($request->ajax()) {
            $translation = $translations->getBySlug($slug);
            if (! $translation) {
                return App::abort(404);
            }
            $post = $translation->post;
            if (!$post->hasTranslation($this->locale)) {
                $post->title = $post->translateOrDefault($this->locale)->title;
                $post->slug = $slug;
            }
            $post->fill($request->all())->save();
            return $post;
        }
    }

    /**
     * Load editor settings form 
     * ajax route
     * @param  $request
     * @return \Illuminate\Http\Response
     */
    public function settings(Request $request, $id)
    {
        if ($request->ajax()) {
            $post = Post::findOrFail($id);
            //$templates = Template::where('active', 1)->lists('name', 'id');
            return view('admin.blog.edit', compact('post'));
        }
    }

    /**
     * Store settings
     * ajax route
     * @param  $request
     * @return \Illuminate\Http\Response
     */
    public function update(PostRequest $request, $id)
    {
        if ($request->ajax()) {
            $post = Post::findOrFail($id);
            if (!$post->hasTranslation($this->locale)) {
                $post->title = $post->translateOrDefault($this->locale)->title;
                $post->slug = $post->translateOrDefault($this->locale)->slug;
            }
            $post->fill($request->all())->save();
            return $post;
        }
    }



    // public function updateContent(Request $request, Post $post)
    // {
    //     $post->fill($request->all())->save();
    //     return $post;
    // }

    // public function loadiFrame($src)
    // {
    //     return view('editor', compact('src'));
    // }
    // 
    public function collectionIndex()
    {
        $posts = Post::where('id', '>', 1)->paginate(10);
        return view('admin.blog.index', compact('posts'));
    }
}
