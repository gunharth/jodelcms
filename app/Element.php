<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Dimsav\Translatable\Translatable;

class Element extends Model
{
    use Translatable;

    public $translatedAttributes = [
        'content',
    ];

    public function region()
    {
        $this->belongsTo(App\Region::class);
    }
}

class ElementTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = ['content'];
}
