<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Dimsav\Translatable\Translatable;

class Element extends Model
{
    use Translatable;

    public $useTranslationFallback = true;

    protected $fillable = ['type','order'];

    public $translatedAttributes = [
        'content',
        'options'
    ];

    protected $with = [
        //'translations'
    ];

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
