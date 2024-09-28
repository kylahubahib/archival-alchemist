<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckSubscriptionController extends Controller
{
    public function checkUserInSpreadsheet(Request $request)
    {
        // Validate that a file was uploaded and that it's a spreadsheet
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        // Get the current authenticated user's ID
        $currentUser = Auth::user();
        $currentUserId = $currentUser->id;

        // Load the uploaded spreadsheet and convert it to an array
        $data = Excel::toArray(null, $request->file('file'));
        $spreadsheetData = $data[0]; // Access the first sheet's data

        // Loop through the spreadsheet rows to check for the current user's ID
        foreach ($spreadsheetData as $row) {
            $spreadsheetId = $row[0]; // Assuming ID is in the first column of the spreadsheet

            // If the user's ID matches one in the spreadsheet
            if ($spreadsheetId == $currentUserId) {
                // Check if the user's ID exists in the subscription table
                $existsInSubscription = DB::table('subscriptions')
                    ->where('id', $spreadsheetId)
                    ->exists();

                if ($existsInSubscription) {
                    // Return true if ID is found in both the spreadsheet and the subscription table
                    return response()->json(['exists' => true], 200);
                }
            }
        }

        // Return false if the user's ID was not found in either the spreadsheet or subscription table
        return response()->json(['exists' => false], 200);
    }


    public function is_premium(Request $request)
    {
        // Get the currently authenticated user
        $user = Auth::user();

        // Check if the user is authenticated
        if ($user) {
            // Return the premium status (1 for premium, 0 for not premium)
            return response()->json([
                'is_premium' => $user->is_premium
            ]);
        } else {
            // Return an error response if the user is not authenticated
            return response()->json([
                'error' => 'User not authenticated.'
            ], 401);  // 401 Unauthorized
        }
    }
}
