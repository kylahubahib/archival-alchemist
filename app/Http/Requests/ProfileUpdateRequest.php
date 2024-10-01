<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            // 'user_pic' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'], // Validate file upload
            'user_pic' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'uni_id_num' => ['nullable', 'string', 'max:255'],
            'user_pnum' => ['nullable', 'string', 'max:255'],
            'user_aboutme' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
