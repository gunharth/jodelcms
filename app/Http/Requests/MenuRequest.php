<?php

namespace App\Http\Requests;

class MenuRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->check();
    }

    /**
     * Request all() override function to pass in slug for validation.
     *
     * @return array
     */
    public function all($keys = null)
    {
        $input = parent::all();
        if (empty($input['slug'])) {
            $input['slug'] = str_slug($input['name']);
        } else {
            $input['slug'] = str_slug($input['slug']);
        }

        return $input;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $global = [
            'name' => 'required|max:30',
            'external_link' => 'required_if:morpher_type,External',
        ];
        switch ($this->method()) {
            case 'GET':
            case 'DELETE':
            {
                return [];
            }
            case 'POST':
            {
                $custom = [
                    'slug'  => 'unique:menu_translations,slug,NULL,menu_id,locale,'.config('app.locale'),
                ];

                return array_merge($global, $custom);
            }
            case 'PUT':
            case 'PATCH':
            {
                $custom = [
                    'slug'  => 'unique:menu_translations,slug,'.$this->route('menu').',menu_id,locale,'.config('app.locale'),
                ];

                return array_merge($global, $custom);
            }
            default:break;
        }
    }
}
