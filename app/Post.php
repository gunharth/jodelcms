<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{

    protected $fillable = [
    	'title',
    	'content'
    ];

    protected $appends = [  
        'link'
    ];

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
        return $this->morphMany('App\Menu', 'morpher');
    }


    public function getLinkAttribute() {
        if($this->slug == 'home') {
            return '/blog';
        }
        return '/blog/'.$this->slug;
    }

}
