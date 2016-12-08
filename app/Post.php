<?php

namespace App;

//use Spatie\Activitylog\Traits\LogsActivity;
use App;
use Carbon\Carbon;
use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    //use LogsActivity;
    use Translatable;

    /**
     * returnController for catch all routes.
     * @return string
     */
    public static function returnController()
    {
        return 'PostsController';
    }

    protected $dates = [
        'published_at',
    ];

    protected $fillable = [
        'title',
        'slug',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'template_id',
        'head_code',
        'body_start_code',
        'body_end_code',
        'published_at',
    ];

    protected $translatedAttributes = [
        'title',
        'slug',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'template_id',
    ];

    protected $with = [
        'template',
        'menu',
        // 'translations',
    ];

    protected $appends = [
        'link',
        // 'next',
        // 'prev'
    ];

    public function scopePublished($query)
    {
        $query->where('published_at', '<=', Carbon::now());
    }

    public function getLinkAttribute()
    {
        $link = '';
        $getlocale = App::getLocale();
        $applocale = config('app.fallback_locale');
        if ($getlocale != $applocale) {
            $link .= '/'.$getlocale;
        }
        $link .= '/blog';
        if ($this->slug == 'blog') {
            return $link;
        }

        return $link.'/'.$this->slug;
    }

    public function getNextAttribute()
    {
        $pubDate = $this->published_at->format('Y-m-d H:i:s');

        return $this->orderBy('published_at')->where('published_at', '>', $pubDate)->where('id', '>', 1)->first();
    }

    public function getPrevAttribute()
    {
        $pubDate = $this->published_at->format('Y-m-d H:i:s');

        return $this->orderBy('published_at', 'DESC')->where('published_at', '<', $pubDate)->where('id', '>', 1)->first();
    }

    // Region::class Morph Relation
    public function regions()
    {
        return $this->morphMany(Region::class, 'regionable');
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
