<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\InstitutionAdmin;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/RegistrationForm');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {

        \Log::info('Register');

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:student,teacher,admin',
            'uni_branch_id' => 'nullable|integer',
            'uni_id_num' => 'nullable|string|max:50',
        ]);

        \Log::info('next validated');

        \Log::info('Validated Data:', $validatedData);

        try {
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'uni_id_num' => $validatedData['uni_id_num'] ?? null,
                'user_type' => $validatedData['role'],
                'user_pic' => 'storage/profile_pics/default_pic.png',
                'user_status' => 'active',
                'is_premium' => false,
            ]);

            \Log::info('User created:', ['user_id' => $user->id]);

            if ($validatedData['role'] === 'student') {
                $student = Student::create([
                    'user_id' => $user->id,
                    'uni_branch_id' => $validatedData['uni_branch_id'] ?? null,
                ]);

                \Log::info('Student created:', ['student_id' => $student->id]);

            } elseif ($validatedData['role'] === 'teacher') {
                $faculty = Faculty::create([
                    'user_id' => $user->id,
                    'uni_branch_id' => $validatedData['uni_branch_id'],
                ]);

                \Log::info('Faculty created:', ['faculty_id' => $faculty->id]);

            } elseif ($validatedData['role'] === 'admin') {
                $institutionAdmin = InstitutionAdmin::create([
                    'user_id' => $user->id,
                    'insub_id' => $validatedData['uni_branch_id'] ?? null,
                ]);

                \Log::info('Institution Admin created:', ['ins_admin_id' => $institutionAdmin->id]);
            }

            event(new Registered($user));

            return redirect()->route('login')->with('success', 'Registration successful. Please log in.');

        } catch (\Exception $e) {
            \Log::error('Error during registration:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'An unexpected error occurred. Please try again.']);
        }
    }
}
