<?php

namespace App;

use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    use Translatable;

    public $useTranslationFallback = true;

    protected $fillable = ['type', 'order'];

    public $translatedAttributes = [
        'content',
        'options',
    ];

    // protected $with = [
    //     //'translations'
    // ];

    public function region()
    {
        $this->belongsTo(App\Region::class);
    }
}

class ElementTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = ['content,options'];
}
