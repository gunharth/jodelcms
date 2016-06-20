<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\SluggableInterface;
use Cviebrock\EloquentSluggable\SluggableTrait;

class Page extends Model implements SluggableInterface
{
    use SluggableTrait;

    protected $sluggable = [
        'build_from' => 'title',
        'save_to'    => 'slug',
    ];

    protected $fillable = [
    	'title', 
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
        'template_id'
    ];

    protected $with = [  
        'template',
        'menu'
    ];

    protected $appends = [  
        'link'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function menu()
    {
        return $this->morphMany('App\menu', 'parser');
    }

    public function getLinkAttribute() {
        if($this->slug == 'home') {
            return '/';
        }
        return '/page/'.$this->slug;
    }

    public function template()
    {
        return $this->belongsTo('App\Template');
    }

}
