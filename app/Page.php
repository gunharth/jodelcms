<?php

namespace App;

use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Page extends Model
{
    use LogsActivity;
    use Translatable;

    //public $useTranslationFallback = true;

    /**
     * returnController for catch all routes.
     * @return string
     */
    public function returnController()
    {
        return 'PagesController';
    }

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
    ];

    public $translatedAttributes = [
        'title',
        'slug',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected static $logAttributes = [
        'title',
        'slug',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'template_id',
        'head_code',
        'body_start_code',
        'body_end_code',
    ];

    protected $with = [
        'template',
        'menu',
        //'translations',
        //'regions',
        //'regions.elements'
    ];

    protected $appends = [
        'link',
    ];

    public function getLinkAttribute()
    {
        if ($this->slug == 'home') {
            return '/';
        }

        return '/page/'.$this->slug;
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

    // public function translations()
    // {
    //     return $this->hasMany(PageTranslation::class);
    // }
}
