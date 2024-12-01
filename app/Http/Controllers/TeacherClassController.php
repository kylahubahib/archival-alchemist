<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use App\Models\Section;
use App\Models\ClassModel;
use App\Models\ManuscriptProject;
use App\Models\User;
use App\Models\Author;
use App\Models\ClassStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB; // Add this line
use Illuminate\Support\Facades\Log;


use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\DriveFile as GoogleDriveFile;
use Google\Service\Drive\Permission;
use App\Notifications\UserNotification;



class TeacherClassController extends Controller
{
    //create class
    public function create(){

    }
        // // Fetch the courses and sections for the logged-in faculty
        // public function getCourses(Request $request)
        // {
        //     // Get the currently authenticated user
        //     $faculty = Faculty::where('user_id', $request->user()->id)->first();

        //     if (!$faculty) {
        //         return response()->json(['error' => 'Faculty not found'], 404);
        //     }

        //     // Get the department based on the faculty's university branch
        //     $department = Department::where('uni_branch_id', $faculty->uni_branch_id)->first();

        //     if (!$department) {
        //         return response()->json(['error' => 'Department not found'], 404);
        //     }

        //     // Get the courses in the department
        //     $courses = Course::where('dept_id', $department->id)->with('section')->get();

        //     // Return courses and their associated sectionsfet
        //     return response()->json([
        //         'faculty' => $faculty,
        //         'department' => $department,
        //         'courses' => $courses
        //     ]);
        // }

    public function DisplayGroupClass()
    {
        // Get the current authenticated user's ID
        $userId = Auth::id();

        // Fetch classes where ins_id matches the user's ID
        $classes = ClassModel::where('ins_id', $userId)->get();

        return response()->json(['classes' => $classes]);
    }


        public function index()
        {
            // Get the logged-in faculty
            $user = Auth::user();

            if($user->user_type === 'teacher')
            {
                $faculty = Faculty::with('university_branch')->where('user_id', Auth::id())->firstOrFail();
            }


            // Get the department associated with the faculty
            $department = Department::where('uni_branch_id', $faculty->uni_branch_id)->first();

            // Get the courses in that department along with their sections
            $courses = Course::where('dept_id', $department->id)->with('sections')->get();

            // Retrieve classes where ins_id matches the current user's ID
            $section = Section::where('ins_id', Auth::id())->get();


            //Retrieve classes where stud_id matches the current user's ID
            $section = Section::where('ins_id', Auth::id())->get();

            return response()->json([
                'courses' => $courses,
                'classes' => $section, // Include the classes in the response
            ]);
        }


        public function newGroupClass(Request $request)
        {
            $request->validate([
                'class_name' => 'required|string',
            ]);

            $userId = Auth::id(); // Get the currently logged-in user's ID

            try {
                // Check if the class name already exists
                $existingClass = ClassModel::where('class_name', $request->class_name)->first();

                if ($existingClass) {
                    // If the class name already exists
                    return response()->json(['success' => false, 'message' => 'Group class already exists']);
                } else {
                    // Generate a unique class code
                    $classCode = $this->generateUniqueClassCode();

                    // Insert the new class with the generated class code
                    ClassModel::create([
                        'class_code' => $classCode,
                        'class_name' => $request->class_name,
                        'ins_id' => $userId,
                    ]);

                    return response()->json(['success' => true, 'message' => 'Group class successfully added']);
                }
            } catch (\Exception $e) {
                // Log the error and return a response
                Log::error('Error adding the class: '.$e->getMessage());
                return response()->json(['success' => false, 'message' => 'An error occurred while adding the group class.'], 500);
            }
        }

        /**
         * Generate a unique class code (6-8 alphanumeric characters) and ensure it doesn't already exist.
         */
        private function generateUniqueClassCode()
        {
            do {
                // Generate a random code between 6-8 characters, using letters and numbers
                $classCode = strtoupper(Str::random(rand(6, 8)));
            } while (ClassModel::where('class_code', $classCode)->exists());

            return $classCode;
        }



    public function getManuscriptsByClass(Request $request)
    {
        $section_id = $request->get('section_id');
        $filter = $request->input('filter');

        Log::info('Section Id:', (array)$section_id);

        // Base query to join manuscripts and class tables
        $query = ManuscriptProject::with(['authors', 'tags', 'revision_history', 'group'])
            ->where('section_id', $section_id);

        // Apply filter condition based on the filter, if set
        if ($filter) {
            switch ($filter) {
                case 'approved':
                    $query->where('man_doc_status', 'A');
                    break;
                case 'declined':
                    $query->where('man_doc_status', 'D');
                    break;
                case 'in_progress':
                    $query->where('man_doc_status', 'I');
                    break;
                case 'pending':
                    $query->where('man_doc_status', 'P');
                    break;
                case 'missing':
                    $query->where('man_doc_status', 'M');
                    break;
            }
        }

        $manuscripts = $query->get();

        // Transform statuses into user-friendly labels
        $manuscripts->transform(function ($manuscript) {
            switch ($manuscript->man_doc_status) {
                case 'A':
                    $manuscript->man_doc_status = 'Approved';
                    break;
                case 'I':
                    $manuscript->man_doc_status = 'In progress';
                    break;
                case 'D':
                    $manuscript->man_doc_status = 'Declined';
                    break;
                case 'T':
                    $manuscript->man_doc_status = 'To-Review';
                    break;
                case 'P':
                    $manuscript->man_doc_status = 'Pending';
                    break;
                default:
                    $manuscript->man_doc_status = 'Missing';
            }
            return $manuscript;
        });

        return response()->json($manuscripts);
    }


    public function updateManuscriptStatus(Request $request, $id)
    {
        // Validate the incoming request to ensure 'status' is present and valid
        $request->validate([
            'status' => 'required|string|in:Y,P,X'
        ]);

        try {
            // Find the manuscript by ID
            $manuscript = ManuscriptProject::findOrFail($id);

            // Update the manuscript's status
            $manuscript->man_doc_status = $request->input('status');
            $manuscript->save();

            // Return a success response
            return response()->json([
                'message' => 'Manuscript status updated successfully',
                'status' => $manuscript->man_doc_status
            ], 200);
        } catch (\Exception $e) {
            // Return an error response in case of failure
            return response()->json([
                'message' => 'Failed to update manuscript status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Class dropdown controller
    // Fetch students based on search query
    public function searchStudents(Request $request)
    {
        $name = $request->query('name');
        $students = User::where('name', 'LIKE', "%{$name}%")->get(['id', 'name']); // Get id and name

        return response()->json($students);
    }


    // public function addStudentsToClass(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'class_name' => 'required|string',
    //         'ins_id' => 'required|integer',
    //         'students' => 'required|array',
    //         'students.*' => 'integer',
    //     ]);

    //     $className = $request->input('class_name');
    //     $instructorId = $request->input('ins_id');
    //     $studentIds = $request->input('students');

    //     DB::beginTransaction();
    //     try {
    //         // Find the class by instructor ID and class name
    //         $class = ClassModel::where('ins_id', $instructorId)
    //                           ->where('class_name', $className)
    //                           ->first();

    //         // Check if the class exists
    //         if ($class) {
    //             // Get existing student IDs from the class
    //             $existingStudentIds = explode(',', $class->stud_id);

    //             // Initialize a count for newly added students
    //             $newlyAddedCount = 0;

    //             foreach ($studentIds as $studentId) {
    //                 // Check if the student is not already in the class
    //                 if (!in_array($studentId, $existingStudentIds)) {
    //                     $existingStudentIds[] = $studentId;
    //                     $newlyAddedCount++;
    //                 }
    //             }

    //             // Update the stud_id field with the new list of student IDs
    //             $class->stud_id = implode(',', $existingStudentIds);
    //             $class->save();

    //             DB::commit();

    //             return response()->json([
    //                 'success' => true,
    //                 'message' => "$newlyAddedCount student(s) added successfully."
    //             ]);
    //         } else {
    //             \Log::error('Class not found for instructor ID: ' . $instructorId . ' and class name: ' . $className);
    //             return response()->json(['message' => 'Class not found.'], 404);
    //         }
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         \Log::error('Error adding students: ' . $e->getMessage());
    //         return response()->json(['message' => 'An error occurred while adding students.'], 500);
    //     }
    // }


    public function addStudentsToClass(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'class_name' => 'required|string',
            'class_code' => 'required|string',
            'ins_id' => 'required|integer',
            'students' => 'required|array',
            'students.*' => 'string', // Expecting student names as strings
        ]);

        $className = $request->input('class_name');
        $classCode = $request->input('class_code');
        $instructorId = $request->input('ins_id');
        $studentNames = $request->input('students'); // Array of student names

        DB::beginTransaction();
        try {
            // Find the class by instructor ID and class name
            $class = ClassModel::where('ins_id', $instructorId)
                                ->where('class_name', $className)
                                ->first();

            if ($class) {
                Log::info('Adding students to class', [
                    'instructor_id' => $instructorId,
                    'class_name' => $className,
                    'class_code' => $classCode,
                    'students' => $studentNames,
                ]);

                // Convert student names to their corresponding user IDs
                $newStudentIds = $this->getUserIdsByNames($studentNames);

                if (!$newStudentIds) {
                    return response()->json(['message' => 'One or more students not found.'], 404);
                }

                // Insert into the class_students table using the ClassStudent model
                foreach ($newStudentIds as $studentId) {
                    // Check if the student is already in the class using Eloquent
                    $exists = ClassStudent::where('class_id', $class->id)
                                          ->where('stud_id', $studentId)
                                          ->exists();

                    if (!$exists) {
                        ClassStudent::create([
                            'class_id' => $class->id,
                            'stud_id' => $studentId,
                        ]);
                    } else {
                        Log::warning("Student already exists in class", [
                            'class_id' => $class->id,
                            'stud_id' => $studentId,
                        ]);
                    }
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => count($newStudentIds) . " student(s) added successfully."
                ]);
            } else {
                return response()->json(['message' => 'Class not found.'], 404);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding students: ', ['exception' => $e]);
            return response()->json(['message' => 'An error occurred while adding students.'], 500);
        }
    }

    /**
     * Convert an array of student names to their corresponding user IDs
     */
    private function getUserIdsByNames(array $studentNames)
    {
        $userIds = [];
        foreach ($studentNames as $name) {
            $user = User::where('name', $name)->first();
            if ($user) {
                $userIds[] = $user->id;
            } else {
                Log::error("User not found: " . $name);
                return null; // Return null if any user is not found
            }
        }
        Log::info('User IDs: ' . implode(',', $userIds)); // Logging the user IDs
        return $userIds;
    }




    //     /**
    //  * Display the group members by manuscript ID.
    //  *
    //  * @param int $manuscriptId
    //  * @return \Illuminate\Http\JsonResponse
    //  */
    // public function ViewGroupMembers($manuscriptId)
    // {
    //     // Retrieve authors by manuscript ID
    //     // $authors = Author::join('users', 'author.user_id', '=', 'users.id')
    //     // ->where('author.man_doc_id', 13)
    //     // ->select('author.*', 'users.name as author_name')
    //     // ->get();



    //     // Check if authors were found
    //     if ($authors->isEmpty()) {
    //         return response()->json(['message' => 'No group members found for this manuscript.'], 404);
    //     }

    //     // Return the authors as JSON
    //     return response()->json($authors);
    // }


    public function ViewGroupMembers($manuscriptId)
    {
        Log::info("Fetching group members for manuscript ID: $manuscriptId");

        try {
            $authors = Author::with('user')
                ->where('man_doc_id', $manuscriptId)
                ->get();

            Log::info("Number of authors retrieved: " . $authors->count());

            if ($authors->isEmpty()) {
                Log::warning("No group members found for manuscript ID: $manuscriptId");
                return response()->json(['message' => 'No group members found for this manuscript.'], 404);
            }

            return response()->json($authors);
        } catch (\Exception $e) {
            Log::error("Error fetching group members: " . $e->getMessage());
            return response()->json(['message' => 'An error occurred while fetching group members.'], 500);
        }
    }


        // 1. Unique Views per User (One View per User)
    public function view_Book($bookId)
{
    $userId = Auth::id(); // Get the currently logged-in user ID

    // Check if the user has already viewed the book
    $existingView = DB::table('book_views')
                      ->where('user_id', $userId)
                      ->where('book_id', $bookId)
                      ->first();

    if (!$existingView) {
        // Record the user's view
        DB::table('book_views')->insert([
            'user_id' => $userId,
            'book_id' => $bookId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Increment the view count for the book
        DB::table('books')
            ->where('id', $bookId)
            ->increment('view_count');
    }

    return response()->json(['message' => 'View recorded']);
}



    // 3. Views by Session or IP Address (Track Views by Session)
    public function viewBook($bookId)
    {
        $userId = Auth::id(); // Get the currently logged-in user ID

        // Log when a user views a book
        Log::info('User ' . $userId . ' is viewing book with ID: ' . $bookId);

        // Check if the user has viewed the book during this session
        if (!session()->has('viewed_books.' . $bookId)) {
            // Record the view in session to prevent duplicate counting
            session()->put('viewed_books.' . $bookId, true);

            // Increment the view count for the book in the database
            DB::table('books')
                ->where('id', $bookId)
                ->increment('view_count');

            // Log the view increment
            Log::info('Book view count incremented for book ID: ' . $bookId);
        }

        // Return a success message
        return response()->json(['message' => 'View recorded']);
    }    public function returnStudentWork(Request $request)
    {
        $manuscriptId = $request->get('manuscript_id');
        Log::info("Starting 'sendForRevision' process for manuscript ID: $manuscriptId");

        // Find the manuscript
        $manuscript = ManuscriptProject::find($manuscriptId);

        if (!$manuscript || empty($manuscript->man_doc_adviser)) {
            Log::warning("Manuscript not found or invalid data. Manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Manuscript not found or invalid data.'], 404);
        }

        $manuscript->update(['man_doc_status' => 'To Review']);
        $googleDocUrl = $manuscript->man_doc_content;
        $googleDocId = $this->extractGoogleDocId($googleDocUrl);

        if (!$googleDocId) {
            Log::warning("Invalid Google Doc URL for manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Invalid Google Doc URL.'], 400);
        }

        // Initialize Google Client
        $client = new GoogleClient();
        $client->setAuthConfig([
            'type' => env('GOOGLE_SERVICE_TYPE'),
            'project_id' => env('GOOGLE_SERVICE_PROJECT_ID'),
            'private_key_id' => env('GOOGLE_SERVICE_PRIVATE_KEY_ID'),
            'private_key' => env('GOOGLE_SERVICE_PRIVATE_KEY'),
            'client_email' => env('GOOGLE_SERVICE_CLIENT_EMAIL'),
            'client_id' => env('GOOGLE_SERVICE_CLIENT_ID'),
            'auth_uri' => env('GOOGLE_SERVICE_AUTH_URI'),
            'token_uri' => env('GOOGLE_SERVICE_TOKEN_URI'),
            'auth_provider_x509_cert_url' => env('GOOGLE_SERVICE_AUTH_PROVIDER_CERT_URL'),
            'client_x509_cert_url' => env('GOOGLE_SERVICE_CLIENT_CERT_URL'),
        ]);
        $client->addScope(GoogleDrive::DRIVE_FILE);
        $client->setSubject('file-manager@document-management-438910.iam.gserviceaccount.com');

        $driveService = new GoogleDrive($client);


        $authors = Author::with('user')->where('man_doc_id', $manuscriptId)->get();
        // $emails = $authors->pluck('user.email')->toArray();


        foreach ($authors as $author) {
            $email = $author->user->email;
            $permId = $author->permission_id;

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                Log::warning('Invalid Email Address:', ['email' => $email]);
                continue;
            }


            try {
                // Fetch existing permissions
                $permissions = $driveService->permissions->listPermissions($googleDocId);
                Log::info("Existing Permissions: ", ['permissions' => $permissions]);

                $permissionFound = false;

                // Delete the existing permission if found
                foreach ($permissions as $permission) {
                    if ($permission->getId() === $permId) {
                        $driveService->permissions->delete($googleDocId, $permission->getId());
                        Log::info("Deleted existing permission for: $email");
                        Log::info("Permission Id:", ['permissions' => $permission->getId()]);
                        Log::info("Permission Id in Author Table:", ['permissions' => $permId]);

                        $permissionFound = true;
                        break;
                    }
                }

                // Create a new permission for the user
                $newPermission = new Permission();
                $newPermission->setType('user');
                $newPermission->setRole('writer');
                $newPermission->setEmailAddress($email);
                $driveService->permissions->create($googleDocId, $newPermission, ['sendNotificationEmail' => false]);
                Log::info("Created new 'reader' permission for: $email");

                // If no permission found, log the error
                if (!$permissionFound) {
                    Log::warning("Permission not found for: $email. Skipping permission creation.");
                }

            } catch (Exception $e) {
                Log::error("Error deleting/creating permission for: $email", ['error' => $e->getMessage()]);
                return response()->json(['error' => 'Error setting permission: ' . $e->getMessage()], 500);
            }
        }

        return response()->json(['success' => 'Document permissions updated successfully.']);
    }


}
