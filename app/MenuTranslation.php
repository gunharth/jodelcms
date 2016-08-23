<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MenuTranslation extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'slug',
        'name',

    ];

    // public function setSlugAttribute($value)
    // {
    //     if (empty($value)) {
    //         $this->attributes['slug'] = str_slug($this->attributes['name']);
    //     } else {
    //         $this->attributes['slug'] = str_slug($value);
    //     }
    // }

    public function getBySlug($slug)
    {
        return $this->where('slug', '=', $slug)->first();
    }

    /**
     * Get the original page.
     *
     * @return Post
     */
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }
}
