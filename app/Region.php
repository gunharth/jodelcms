<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    public function regionable()
    {
        return $this->morphTo();
    }

    protected $with = [
        //'elements'
    ];

    public function elements()
    {
        return $this->hasMany(Element::class)->orderBy('order');
    }
}
