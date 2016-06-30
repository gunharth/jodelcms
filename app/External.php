<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class External extends Model
{
        public function menu()
    {
        return $this->morphMany('App\Menu', 'morpher');
    }
}
