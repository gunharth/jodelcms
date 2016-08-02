<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\SluggableInterface;
use Cviebrock\EloquentSluggable\SluggableTrait;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Translatable\HasTranslations;
use App\Menu;
use App\Template;

class Page extends Model implements SluggableInterface
{
    use SluggableTrait;
    use LogsActivity;
    use HasTranslations;

    protected $sluggable = [
        'build_from' => 'title',
        'save_to'    => 'slug',
        'on_update'  => true
    ];

    protected $fillable = [
        'title',
        'slug',
        'content01',
        'content02',
        'content03',
        'content04',
        'content05',
        'content06',
        'content07',
        'content08',
        'content09',
        'content10',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'template_id',
        'head_code',
        'body_start_code',
        'body_end_code'
    ];

    public $translatable = [
        'content01',
        'slug',
        ];

    protected static $logAttributes = [
        'title',
        'slug',
        'content01',
        'content02',
        'content03',
        'content04',
        'content05',
        'content06',
        'content07',
        'content08',
        'content09',
        'content10',
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

    public function returnController()
    {
        return 'PagesController';
    }

    // public function getRouteKeyName()
    // {
    //     return 'slug';
    // }

    public function menu()
    {
        return $this->morphMany(Menu::class, 'morpher');
    }

    public function getLinkAttribute()
    {
        if ($this->slug == 'home') {
            return '/';
        }
        return '/page/'.$this->slug;
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }
}
