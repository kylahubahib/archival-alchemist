<?php

namespace App\Http\Controllers\Pages\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Department;
use App\Models\ManuscriptProject;
use App\Models\Section;
use App\Models\University;
use App\Models\UniversityBranch;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SuperAdminArchiveController extends Controller
{
    protected $authUserId;
    protected $insAdminUniBranchId;
    protected $insAdminAffiliation;
    protected $selectedUniId;
    protected $selectedUniBranchId;
    protected $selectedDeptId;
    protected $selectedCourseId;
    protected $selectedSectionId;

    public function __construct()
    {
        $this->authUserId = Auth::id();
    }

    public function index()
    {
        return $this->filter();
    }

    public function filter($university = null, $branch = null, $department = null, $course = null, $section = null)
    {
        $search = request('search', null);
        $manDocVisibility = request('manuscript_visibility', null);
        $universityFolders = [];
        $branchFolders = [];
        $departmentFolders = [];
        $courseFolders = [];
        $sectionFolders = [];
        $searchResults = [];
        $manuscripts = [];

        \Log::info(['search' => $search]);

        \Log::info(['$section' => $section]);

        $searchResults = $universityFolders = $this->getUniversityFolders($search);

        if ($university) {
            $searchResults = $branchFolders = $this->getBranchFolders($university, $search);
        }

        if ($branch) {
            $searchResults = $departmentFolders = $this->getDepartmentFolders($branch, $search);
        }

        if ($department) {
            $searchResults = $courseFolders = $this->getCourseFolders($department, $search);
        }

        if ($course) {
            $searchResults = $sectionFolders = $this->getSectionFolders($course, $search);
        }

        if ($section) {
            $searchResults = $manuscripts = $this->getManuscriptsFromSection($section, $search, $manDocVisibility);
        }

        if (request()->expectsJson()) {
            return response()->json($searchResults);
        }

        return Inertia::render('SuperAdmin/Archives/Archives', [
            'insAdminAffiliation' => $this->insAdminAffiliation,
            // Group the data to avoid passing many props to the client-side
            'folders' => [
                'universityFolders' => $universityFolders,
                'branchFolders' => $branchFolders,
                'departmentFolders' => $departmentFolders,
                'courseFolders' => $courseFolders,
                'sectionFolders' => $sectionFolders,
            ],
            'manuscripts' => $manuscripts,
            'search' => $search,
        ]);
    }

    // FOLDERS NAVIGATION
    public function getUniversityFolders($searchTerm = null)
    {
        // If searchTerm is provided, perform a search, otherwise return an empty collection or all universities
        $query = University::query();

        // Apply search condition only if a search term is provided
        if ($searchTerm) {
            $query->where('uni_name', 'LIKE', '%' . $searchTerm . '%');
        }

        // Get the result
        $universities = $query->select(
            'id',
            'uni_name as sub_name',
            'uni_acronym as category_on_select',
            'created_at',
            'updated_at'
        )
            ->get();

        return $universities;
    }


    public function getBranchFolders($uniAcronym, $searchTerm)
    {
        $this->selectedUniId = University::where('uni_acronym', $uniAcronym)->value('id');

        $universityBranches = UniversityBranch::where('uni_id', $this->selectedUniId)
            ->where('uni_branch_name', 'LIKE', '%' . $searchTerm . '%')
            ->select(
                'id',
                'uni_branch_name as category_on_select',
                'created_at',
                'updated_at'
            )
            ->get();

        return $universityBranches;
    }

    public function getDepartmentFolders($uniBranchName, $searchTerm)
    {
        $this->selectedUniBranchId = UniversityBranch::where('uni_branch_name', $uniBranchName)
            ->where('uni_id', $this->selectedUniId)
            ->value('id');

        Log::info('searchTerm department part', ['searchTerm' => $searchTerm]);


        $departments = Department::where('uni_branch_id', $this->selectedUniBranchId)
            ->where('dept_name', 'LIKE', '%' . $searchTerm . '%')
            // Use alias for naming consistency to be used in the view
            ->select(
                'id',
                'dept_name as sub_name',
                // Becomes a file category when clicked as a file
                'dept_acronym as category_on_select',
                'added_by',
                'created_at',
                'updated_at'
            )
            ->get();

        return $departments;
    }

    // Pass $deptAcronym for readable dynamic URL purposes instead of IDs
    public function getCourseFolders($deptAcronym, $searchTerm)
    {
        $this->selectedDeptId = Department::where('dept_acronym', $deptAcronym)
            // Ensure the correct department ID by its foreign key to the branch assigned by the ins admin
            ->where('uni_branch_id', $this->selectedUniBranchId)
            ->value('id');

        $courses = Course::where('dept_id', $this->selectedDeptId)
            ->where('course_name', 'LIKE', '%' . $searchTerm . '%')
            ->select(
                'id',
                'course_name as sub_name',
                'course_acronym as category_on_select',
                'added_by',
                'created_at',
                'updated_at'
            )
            ->get();

        return $courses;
    }

    public function getSectionFolders($courseAcronym, $searchTerm)
    {
        $this->selectedCourseId = Course::where('course_acronym', $courseAcronym)
            ->where('dept_id', $this->selectedDeptId)
            ->value('id');

        // Use the correct courseId to get its related sections
        $sections = Section::where('course_id',  $this->selectedCourseId)
            ->where('section_name', 'LIKE', '%' . $searchTerm . '%')
            ->select(
                'id',
                'section_name as category_on_select',
                'created_at',
                'updated_at',
            )
            ->get();

        return $sections;
    }

    public function getManuscriptsFromSection($sectionName, $searchTerm, $manDocVisibility)
    {
        $this->selectedSectionId = Section::where('section_name', $sectionName)
            ->where('course_id', $this->selectedCourseId)
            ->value('id');

        Log::info('selectedSectionId', ['selectedSectionId' => $this->selectedSectionId]);
        Log::info('searchTerm section part', ['searchTerm' => $searchTerm]);

        $manuscripts = ManuscriptProject::where('section_id', $this->selectedSectionId)
            ->where('is_publish', true)
            ->where(function ($query) use ($searchTerm) {
                $query->where('man_doc_title', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhereHas('tags', function ($query) use ($searchTerm) {
                        $query->where('tags_name', 'LIKE', '%' . $searchTerm . '%');
                    });
            })
            ->where(function ($query) use ($manDocVisibility) {
                if ($manDocVisibility !== null) {
                    $query->where('man_doc_visibility', $manDocVisibility);
                }
            })
            ->with(['tags', 'group', 'group.group_member', 'group.group_member.student.user'])
            ->get();


        // Formats the manuscript data before passing it to the view
        $manuscripts->each(function ($manuscript) {
            // Add alias manuscript_id key that stores the manuscript id for readability
            $manuscript->manuscript_id = $manuscript->id;

            $manuscript->tag_names = $manuscript->tags->pluck('tags_name');
            $manuscript->capstone_group = $manuscript->group ? [$manuscript->group->group_name] : [];

            // Ensure group and group_member are not null
            if ($manuscript->group && $manuscript->group->group_member) {
                $manuscript->group_members = $manuscript->group->group_member->pluck('stud_id');
            } else {
                $manuscript->group_members = [];
            }

            // Ensure group_member and student relationships are not null before accessing
            $manuscript->authors = $manuscript->group && $manuscript->group->group_member
                ? $manuscript->group->group_member
                ->map(fn($member) => $member->student->user->name ?? null)
                ->filter() // Remove null values
                ->values() // Re-index the array
                ->toArray()
                : [];

            // Remove unnecessary loaded relationships
            unset($manuscript->tags, $manuscript->group);
        });

        return $manuscripts;
    }


    public function getFilteredManuscriptsByVisibility($manDocVisibility)
    {

        \Log::info(['mandocvis' => $manDocVisibility]);
        \Log::info(['selectedSectionId' => $this->selectedSectionId]);

        if (!$this->selectedSectionId) {
            return response()->json([
                'error' => 'Section ID and visibility are required.'
            ], 400);
        }

        $manuscripts = ManuscriptProject::where('section_id', $this->selectedSectionId)
            ->where('man_doc_visibility', $manDocVisibility)
            ->get();

        return $manuscripts;
    }

    public function downloadManuscript($id)
    {
        return $this->handleFileResponse($id, 'attachment');
    }

    public function openManuscript($id)
    {
        return $this->handleFileResponse($id, 'inline');
    }

    public function handleFileResponse($id, $disposition)
    {
        // Retrieve the manuscript record
        $manuscript = ManuscriptProject::findOrFail($id);

        // Get file details using the common method
        $fileDetails = $this->getFileDetails($manuscript->man_doc_content);

        if (!$fileDetails) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        // Prepare the content disposition header
        $contentDisposition = $disposition . '; filename="' . $fileDetails['fileName'] . '"';

        // Define the headers
        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => $contentDisposition,
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        // Return the appropriate response based on the disposition type
        if ($disposition === 'attachment') {
            return response()->download($fileDetails['filePath'], $fileDetails['fileName'], $headers);
        }

        // For inline display (PDF)
        return response()->file($fileDetails['filePath'], $headers);
    }

    public function getFileDetails($dbFilePath)
    {
        // Adjust the path to match the private storage folder (remove 'storage/' from the db file path)
        $filePath = storage_path('app/private/' . str_replace('storage/', '', $dbFilePath));


        // Check if the file exists
        if (!file_exists($filePath)) {
            return null;
        }

        // Get the file name from the path
        $fileName = basename($dbFilePath);
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        Log::info(['fileName' => $fileName]);


        // Ensure the file is a PDF (if not, append ".pdf" to the file name)
        if (strtolower($extension) !== 'pdf') {
            $fileName .= '.pdf';
        }

        return ['filePath' => $filePath, 'fileName' => $fileName];
    }


    // public function downloadManuscript($id)
    // {
    //     return $this->handleFileResponse($id, 'attachment');
    // }

    // // Method for handling viewing the manuscript PDF inline in the browser
    // public function openManuscript($id)
    // {
    //     return $this->handleFileResponse($id, 'inline');
    // }

    // // Common method to handle file responses (both download and inline display)
    // public function handleFileResponse($id, $disposition)
    // {
    //     // Retrieve the manuscript record
    //     $manuscript = ManuscriptProject::findOrFail($id);

    //     // Get file details using the common method
    //     $fileDetails = $this->getFileDetails($manuscript->man_doc_content);

    //     if (!$fileDetails) {
    //         return response()->json(['error' => 'File not found.'], 404);
    //     }

    //     // Prepare the content disposition header
    //     $contentDisposition = $disposition . '; filename="' . $fileDetails['fileName'] . '"';

    //     // Define the headers for the response
    //     $headers = [
    //         'Content-Type' => 'application/pdf',
    //         'Content-Disposition' => $contentDisposition,
    //         'Cache-Control' => 'no-store, no-cache, must-revalidate',
    //         'Pragma' => 'no-cache',
    //         'Expires' => '0',
    //     ];

    //     // Call the method to generate the new PDF with updated metadata
    //     return $this->generatePDFWithMetadata($manuscript, $fileDetails, $contentDisposition);
    // }

    // // Method to get file details from the database and prepare the file path
    // public function getFileDetails($dbFilePath)
    // {
    //     // Adjust the path to match the private storage folder (remove 'storage/' from the db file path)
    //     $filePath = storage_path('app/private/' . str_replace('storage/', '', $dbFilePath));

    //     // Check if the file exists
    //     if (!file_exists($filePath)) {
    //         return null;
    //     }

    //     // Get the file name from the path
    //     $fileName = basename($dbFilePath);
    //     $extension = pathinfo($fileName, PATHINFO_EXTENSION);

    //     // Log the file path for debugging purposes
    //     Log::info(['fileName' => $fileName]);

    //     // Ensure the file is a PDF (if not, append ".pdf" to the file name)
    //     if (strtolower($extension) !== 'pdf') {
    //         $fileName .= '.pdf';
    //     }

    //     return ['filePath' => $filePath, 'fileName' => $fileName];
    // }

    // // Method to generate a new PDF with updated metadata using TCPDF and FPDI
    // public function generatePDFWithMetadata($manuscript, $fileDetails, $contentDisposition)
    // {
    //     // Set up FPDI (TCPDF)
    //     $pdf = new Fpdi();

    //     // Retrieve the file path of the original manuscript
    //     $filePath = $fileDetails['filePath'];

    //     // Set metadata (change title, author, and subject)
    //     $pdf->SetCreator('Your Application');
    //     $pdf->SetAuthor("Author: " . $manuscript->author);
    //     $pdf->SetTitle("Updated Manuscript Title - " . $manuscript->title);  // Modify the title
    //     $pdf->SetSubject("Subject: " . $manuscript->subject);  // Optionally set other metadata fields

    //     // Import the existing PDF content
    //     $pageCount = $pdf->setSourceFile($filePath); // Load the original PDF

    //     // Iterate through the pages and import them into the new document
    //     for ($i = 1; $i <= $pageCount; $i++) {
    //         // Import each page
    //         $tplIdx = $pdf->importPage($i);
    //         $pdf->AddPage();
    //         $pdf->useTemplate($tplIdx);
    //     }

    //     // Output the PDF directly to the browser (without saving it to the disk)
    //     return $pdf->Output('D', $fileDetails['fileName']);  // 'D' means download, or 'I' for inline view
    // }
}
