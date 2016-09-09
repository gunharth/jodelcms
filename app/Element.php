<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Element extends Model
{

	use \Dimsav\Translatable\Translatable;

	public $translatedAttributes = [
		'content01'
	];
    protected $fillable = ['code'];
    
    protected $with = ['translations'];

    

    public function region() 
    {
    		$this->belongsTo(App\Region::class);
    }
}

class ElementTranslation extends Model {

    public $timestamps = false;
    protected $fillable = ['title'];

}
