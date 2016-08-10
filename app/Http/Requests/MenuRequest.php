<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class MenuRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
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
            'external_link' => 'required_if:morpher_type,External'
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
                    //'slug'  => 'required|unique:menus'
                ];
                return array_merge($global, $custom);
            }
            case 'PUT':
            case 'PATCH':
            {
                $custom = [
                    //'slug'  => 'required|unique:menus,slug,'.$this->route('menu')
                ];
                return array_merge($global, $custom);
            }
            default:break;
        }
    }
}
