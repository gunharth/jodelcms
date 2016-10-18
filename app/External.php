<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class External extends Model
{
    // Menu::class Morph Relation
    public function menu()
    {
        return $this->morphMany(Menu::class, 'morpher');
    }
}
