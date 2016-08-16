<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Setting;

use Cache;

class SettingsController extends Controller
{
    /**
	 * Updates the settings.
	 *
	 * @param int                                 $id
	 * @param \Illuminate\Contracts\Cache\Factory $cache
	 *
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function update(Request $request)
	{
	    // ...
	    //dd($request->input());
	    $settings = $request->input();
	    $settings = array_except($settings, ['_token','_method']);
	    foreach($settings as $name => $value) {
	    	$this->updateSetting($name,$value);

	    }
	    Cache::forget('settings');
	    return 'true';
	    // E.g., redirect back to the settings index page with a success flash message
	    //return redirect()->route('admin.settings.index')
	    //    ->with('updated', true);
	}

	public function updateSetting($name,$value)
	{
	    $setting = Setting::where('name',$name)->first();
	    $setting->value = $value;
	    $setting->save();
	}
}
