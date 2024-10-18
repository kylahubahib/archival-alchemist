<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Carbon\Carbon;


use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\InstitutionAdmin;
use App\Models\InstitutionSubscription;

use App\Notifications\InstitutionAdminRegistrationNotification;



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
            'user_dob' => 'required|string|max:255',
            'ins_admin_proof' => 'nullable|file|mimes:pdf,jpg,png,docx|max:2048'
        ]);
        
        \Log::info('Validated Data:', $validatedData);
        
        $file = $request->file('ins_admin_proof');
        
        if ($file) {
            \Log::info('File:', [
                'name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);
        
            // Generate a unique file name
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            // Store the file in the 'admin_proof_files' directory
            $file->storeAs('admin_proof_files', $fileName, 'public');
            
        } else {
            \Log::info('No file uploaded for ins_admin_proof.');
        }
        

        //\Log::info('File:', $fileName);
        //Result: 09/01/2005
        //$formattedDate = Carbon::createFromFormat('Y-m-d',  $validatedData['user_dob'])->format('m/d/Y');

        //Result: 9/1/2005
        $formattedDate = Carbon::createFromFormat('Y-m-d',  $validatedData['user_dob'])->format('n/j/Y');
        
        if($validatedData['uni_id_num'] != null && $validatedData['uni_branch_id'] != null)
        {
            $is_affiliated = true;
        }
        
        \Log::info($formattedDate);

        try {
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'uni_id_num' => $validatedData['uni_id_num'] ?? null,
                'user_type' => $validatedData['role'],
                'user_pic' => 'storage/profile_pics/default_pic.png',
                'user_status' => 'active',
                'user_dob' => $formattedDate,
                'is_premium' => false,
                'is_affiliated' => $is_affiliated ?? false
            ]);

            \Log::info('User created:', $user->toArray());

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

                $institutionSubscription = InstitutionSubscription::create([
                    'uni_branch_id' => $validatedData['uni_branch_id'],
                    'plan_id' => 6,
                    'insub_status' => 'Active',
                    'total_amount' => 0.00,
                    'insub_content' => null,
                    'insub_num_user' => 100,
                    'start_date' => null,
                    'end_date' => null,
                    'notify_renewal' => 0
                ]);

                $institutionAdmin = InstitutionAdmin::create([
                    'user_id' => $user->id,
                    'insub_id' => $institutionSubscription->id,
                    'ins_admin_proof' => 'storage/admin_proof_files/' . $fileName,
                ]);

                \Log::info('Institution Admin created:', ['ins_admin_id' => $institutionAdmin->id]);

                if($institutionAdmin)
                {
                    $superadmins = User::where('user_type', 'superadmin')->get();

                //Notify the superadmin for the newly registered institution admin
                if ($superadmins->isNotEmpty()) {
                    foreach ($superadmins as $superadmin) {
                        $superadmin->notify(new InstitutionAdminRegistrationNotification($institutionAdmin));
                    }
                }
                }

                

                
            }

    

            event(new Registered($user));

            return redirect()->route('login')->with('success', 'Registration successful. Please log in.');

        } catch (\Exception $e) {
            \Log::error('Error during registration:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'An unexpected error occurred. Please try again.']);
        }
    }
}
