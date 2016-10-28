<?php

namespace App\Providers;

use App;
use Cache;
use Schema;
use App\Setting;
use Illuminate\Support\ServiceProvider;

class SettingsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot(Setting $settings)
    {
        // Fix for enabling sqlite foreign key constraints
        if (config('database.default') == 'sqlite') {
            $db = app()->make('db');
            $db->connection()->getPdo()->exec('pragma foreign_keys=1');
        }

        // Add settings to config and cache at boot
        // but only after migrations are done, i.e in local & testing env
        if (App::environment('local', 'testing')) {
            if (Schema::hasTable('settings')) {
                $this->loadSettings($settings);
            }
        } else {
            $this->loadSettings($settings);
        }
    }

    /**
     * load app settings.
     * @param  Settings $settings load settings
     * @return settings and add to config
     */
    public function loadSettings($settings)
    {
        $settings = Cache::remember('settings', 60, function () use ($settings) {
            return $settings->pluck('value', 'name')->all();
        });
        config()->set('settings', $settings);
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
