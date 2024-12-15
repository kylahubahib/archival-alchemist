<?php

namespace App\Http\Controllers\Pages\InstitutionAdmin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Http\Controllers\Pages\SuperAdmin\SuperAdminArchiveController;
use App\Models\Course;
use App\Models\Department;
use App\Models\ManuscriptProject;
use App\Models\Section;
use App\Models\UniversityBranch;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InsAdminArchiveController extends Controller
{
    protected $authUserId;
    protected $insAdminUniBranchId;
    protected $insAdminAffiliation;
    protected $selectedDeptId;
    protected $selectedCourseId;
    protected $selectedSectionId;
    protected $superAdminArchive;

    public function __construct()
    {
        $commonData = new InsAdminCommonDataController();
        $this->superAdminArchive =  new SuperAdminArchiveController();
        $this->authUserId = Auth::id();
        $this->insAdminUniBranchId = $commonData->getInsAdminUniBranchId();
        $this->insAdminAffiliation = $commonData->getInsAdminAffiliation();
    }

    public function index()
    {
        return $this->filter();
    }

    public function filter($department = null, $course = null, $section = null)
    {
        $search = request('search', null);
        $manDocVisibility = request('manuscript_visibility', null);
        $departmentFolders = [];
        $courseFolders = [];
        $sectionFolders = [];
        $manuscripts = [];
        $searchResults = [];

        $searchResults = $departmentFolders = $this->getDepartmentFolders($search);

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

        return Inertia::render('InstitutionAdmin/Archives/Archives', [
            'insAdminAffiliation' => $this->insAdminAffiliation,
            // Group the data to avoid passing many props to the client-side
            'folders' => [
                'departmentFolders' => $departmentFolders,
                'courseFolders' => $courseFolders,
                'sectionFolders' => $sectionFolders,
            ],
            'search' => $search,
            'manuscripts' => $manuscripts,
        ]);
    }

    // FOLDERS NAVIGATION
    public function getDepartmentFolders($searchTerm)
    {
        $departments = Department::where('uni_branch_id', $this->insAdminUniBranchId)
            ->where('dept_acronym', 'LIKE', '%' . $searchTerm . '%')
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
            ->where('uni_branch_id', $this->insAdminUniBranchId)
            ->value('id');

        // Update the global variable to be used when checking the course ID and its sections

        Log::info('selectedDeptId', ['deptId' => $this->selectedDeptId]);


        $courses = Course::where('dept_id', $this->selectedDeptId)
            ->where('course_acronym', 'LIKE', '%' . $searchTerm . '%')
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
            // Add alias manuscript_id key for readability
            $manuscript->manuscript_id = $manuscript->id;

            // Handle tags safely
            $manuscript->tag_names = $manuscript->tags->pluck('tags_name') ?? collect();

            // Handle capstone group safely
            $manuscript->capstone_group = $manuscript->group ? [$manuscript->group->group_name] : [];

            // Handle group members safely
            $manuscript->group_members = $manuscript->group?->group_member?->pluck('stud_id') ?? collect();

            // Safely map through group members to fetch author names
            $manuscript->authors = $manuscript->group?->group_member
                ? $manuscript->group->group_member
                ->map(fn($member) => $member->student?->user?->name ?? null)
                ->filter() // Remove null values
                ->values() // Re-index the array
                ->toArray()
                : []; // Default to an empty array if group or members are null

            // Remove unnecessary loaded relationships
            unset($manuscript->tags, $manuscript->group);
        });

        return $manuscripts;
    }

    public function setManuscriptVisibility(Request $request)
    {
        $request->validate([
            'manuscript_id' => 'required|exists:manuscripts,id',
            'manuscript_visibility' => 'required|in:Public,Private',
        ]);

        // Count the total public manuscripts related to the given UniversityBranchP
        $totalPublicManuscripts = ManuscriptProject::where('man_doc_visibility', 'Public')
            ->whereHas('section.course.department.university_branch', function ($query) {
                $query->where('id', $this->insAdminUniBranchId); // Filter by UniversityBranch ID
            })
            ->count();

        Log::info(['totalPublicManuscripts' => $totalPublicManuscripts]);
        Log::info(['manuscript_visibility' =>  $request->manuscript_visibility]);
        Log::info(['manuscript_id' =>  $request->manuscript_id]);

        // Fetch the manuscript to be updated
        $manuscript = ManuscriptProject::findOrFail($request->manuscript_id);

        // Check if the manuscript visibility can be updated based on the public manuscripts count
        if ($totalPublicManuscripts <= 3 && $request->manuscript_visibility === 'Private') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update to private. Must have at least 3 public manuscripts to display.',
            ], 400); // 400 Bad Request
        }

        // Update the manuscript visibility based on the conditions
        $manuscript->man_doc_visibility = $request->manuscript_visibility;

        // Save the changes
        $manuscript->save();

        UserLog::create([
            'user_id' => $this->authUserId, // Log the action by the currently authenticated user
            'log_activity' => "Updated Manuscript Visibility", // Activity title
            'log_activity_content' => "Updated visibility of manuscript <strong>{$manuscript->title}</strong> to <strong>{$manuscript->man_doc_visibility}</strong>.",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Manuscript visibility updated successfully.',
        ]);
    }

    public function downloadManuscript($id)
    {
        return $this->superAdminArchive->handleFileResponse($id, 'attachment');
    }

    public function openManuscript($id)
    {
        return $this->superAdminArchive->handleFileResponse($id, 'inline');
    }
}
