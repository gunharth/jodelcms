<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\SluggableInterface;
use Cviebrock\EloquentSluggable\SluggableTrait;
use App\Menu;
use App\Template;

class Post extends Model implements SluggableInterface
{
    use SluggableTrait;

    protected $sluggable = [
        'build_from' => 'title',
        'save_to'    => 'slug',
        'on_update'  => false
    ];

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

    protected $with = [
        'template',
        'menu'
    ];

    protected $appends = [
        'link'
    ];

    public static function returnController()
    {
        return 'PostsController';
    }

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
    

    public function menu()
    {
        return $this->morphMany(Menu::class, 'morpher');
    }


    public function getLinkAttribute()
    {
        if ($this->slug == 'blog') {
            return '/blog';
        }
        return '/blog/'.$this->slug;
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }
}
