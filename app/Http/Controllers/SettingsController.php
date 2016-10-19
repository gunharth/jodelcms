<?php

namespace App\Http\Controllers;

use Cache;
use App\Setting;
use Illuminate\Http\Request;

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
        $settings = $request->input();
        $settings = array_except($settings, ['_token', '_method']);
        foreach ($settings as $name => $value) {
            $this->updateSetting($name, $value);
        }
        Cache::forget('settings');

        return 'true';
        // E.g., redirect back to the settings index page with a success flash message
        //return redirect()->route('admin.settings.index')
        //    ->with('updated', true);
    }

    public function updateSetting($name, $value)
    {
        $setting = Setting::where('name', $name)->first();
        $setting->value = $value;
        $setting->save();
    }

    /**
     * Load editor settings form
     * ajax route.
     * @param  $request
     * @return \Illuminate\Http\Response
     */
    public function settings(Request $request)
    {
        if ($request->ajax()) {
            //App::setLocale($editorLocale);
            $settings = Setting::all();

            return view('admin.settings.settings', compact('settings'));
        }
    }
}
