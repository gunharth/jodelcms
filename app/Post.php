<?php

namespace App;

//use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Dimsav\Translatable\Translatable;
use App\Template;
use App\Menu;
use App;

class Post extends Model
{
    //use LogsActivity;
    use Translatable;

    /**
     * returnController for catch all routes
     * @return string
     */
    public static function returnController()
    {
        return 'PostsController';
    }

    protected $fillable = [
        'title',
        'slug',
        'content01',
        'content02',
        'content03',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'template_id',
        'head_code',
        'body_start_code',
        'body_end_code'
    ];

    protected $translatedAttributes = [
        'title',
        'slug',
        'content01',
        'content02',
        'content03',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'template_id',
        'head_code',
        'body_start_code',
        'body_end_code'
    ];

    protected $with = [
        'template',
        'menu',
        'translations'
    ];

    protected $appends = [
        'link'
    ];

    public function getLinkAttribute()
    {
        $link = '';
        $getlocale = App::getLocale();
        $applocale = config('app.fallback_locale');
        if($getlocale != $applocale) {
            $link .= '/'. $getlocale;
        }
        $link .= '/blog';
        if ($this->slug == 'blog') {
            return $link;
        }
        return $link . '/'.$this->slug;
    }

    
    // Menu::class Morph Relation
    public function menu()
    {
        return $this->morphMany(Menu::class, 'morpher');
    }

    // Template::class Relation
    public function template()
    {
        return $this->belongsTo(Template::class);
    }
}
