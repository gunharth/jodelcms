<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PostTranslation extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'title',
        'slug',
        // 'content01',
        // 'content02',
        // 'content03',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'template_id',
    ];

    // public function setSlugAttribute($value)
    // {
    //     if (empty($value)) {
    //         $this->attributes['slug'] = str_slug($this->attributes['title']);
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
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
