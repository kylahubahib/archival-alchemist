<?php

namespace App\Http\Controllers;

use App\Models\ManuscriptProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        // Validate the input
        $request->validate([
            'query' => 'required|string|max:255',
        ]);

        // Get the search query
        $searchQuery = $request->input('query');

        // Search in the manuscript table for book titles
        $manuscripts = DB::table('manuscripts')
            ->where('title', 'LIKE', '%' . $searchQuery . '%')
            ->select('title', 'id', 'created_at', DB::raw("'manuscripts' as source"));

        // Search in the tags table
        $tags = DB::table('tags')
            ->where('tag_name', 'LIKE', '%' . $searchQuery . '%')
            ->select('tag_name as title', 'id', 'created_at', DB::raw("'tags' as source"));

        // Search in the users table for user names
        $users = DB::table('users')
            ->where('name', 'LIKE', '%' . $searchQuery . '%')
            ->select('name as title', 'id', 'created_at', DB::raw("'users' as source"));

        // Search in the university table
        $universities = DB::table('universities')
            ->where('name', 'LIKE', '%' . $searchQuery . '%')
            ->select('name as title', 'id', 'created_at', DB::raw("'universities' as source"));

        // Search in the university_branches table
        $universityBranches = DB::table('university_branches')
            ->where('branch_name', 'LIKE', '%' . $searchQuery . '%')
            ->select('branch_name as title', 'id', 'created_at', DB::raw("'university_branches' as source"));

        // Combine all the queries
        $results = $manuscripts
            ->union($tags)
            ->union($users)
            ->union($universities)
            ->union($universityBranches)
            ->orderBy('created_at', 'desc')
            ->get();

        // Return the results
        return response()->json($results);
    }




        public function searchlib(Request $request)
    {
        // Validate the input
        $request->validate([
            'query' => 'required|string|max:255',
        ]);

        // Get the search query
        $searchQuery = $request->input('query');

        // Search in the manuscript table for book titles
        $manuscripts = ManuscriptProject::where('title', 'LIKE', '%' . $searchQuery . '%')
        ->select('title', 'id', 'created_at', DB::raw("'manuscripts' as source"))
        ->orderBy('created_at', 'desc')
        ->get();


        // Return the results
        return response()->json($manuscripts);
    }

}
