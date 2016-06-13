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
    	'contentTitle', 
    	'contentLeft', 
    	'contentRight',
        'meta_description',
        'meta_keywords'
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
        return $this->morphMany('App\Menu', 'parser');
    }

    public function getLinkAttribute() {
        if($this->slug == 'home') {
            return '/';
        }
        return '/page/'.$this->slug;
    }

}
