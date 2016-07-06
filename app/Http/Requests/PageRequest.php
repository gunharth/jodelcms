<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class PageRequest extends Request
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
            'title' => 'required|max:30',
        ];
        switch ($this->method()) {
            case 'GET':
            case 'DELETE':
            {
                return [];
            }
            case 'POST':
            {
                $custom = [];
                return array_merge($global, $custom);
            }
            case 'PUT':
            case 'PATCH':
            {
                $custom = [];
                if (substr_compare($this->path(), "content", -1, 7)) {
                    return [];
                }
                return array_merge($global, $custom);
            }
            default:break;
        }
    }
}
