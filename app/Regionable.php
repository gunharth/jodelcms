<?php

namespace App;

trait Regionable
{
    /**
     * Fetch all regions for the model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function regions()
    {
        return $this->morphMany(Region::class, 'regionable');
    }

    public function elements()
    {
        return $this->hasMany(Element::class);
    }

    /*
     * Have the authenticated user favorite the model.
     *
     * @return void
     */
    // public function favorite()
    // {
    //     $this->favorites()->save(
    //         new Favorite(['user_id' => auth()->id()])
    //     );
    // }
}
