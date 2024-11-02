<?php

namespace App\Traits;

use App\Models\InstitutionSubscription;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;

trait CheckSubscriptionTrait
{
    public function checkInstitutionSubscription($checkInSub, $user)
    {
        // If there's a subscription and it has content
        if ($checkInSub != null && $checkInSub->insub_content != null) {
            // Retrieve the CSV file path from the subscription
            $filePath = $checkInSub->insub_content;

            if (!file_exists($filePath)) {
                Log::error('CSV file not found: ' . $filePath);
                return false; 
            }
    
            // Retrieve data from the CSV file
            $csvData = Excel::toArray(new UsersImport, public_path($filePath));
    
            // Log user data
            Log::info('Auth ' . $user->uni_id_num . ' ' . $user->name . ' ' . $user->user_dob);
    
            // If CSV data is not empty and in the expected format
            if (!empty($csvData) && !empty($csvData[0])) {
                $data = $csvData[0];
    
                foreach ($data as $row) {
                    if (count($row) >= 5) {
                        Log::info($row['id_number'] . ' ' . $row['name'] . ' ' . $row['dob']);
                        if ($row['id_number'] == $user->uni_id_num && $row['name'] == $user->name && $row['dob'] == $user->user_dob) {

                            //Check if subscription is active
                            if($checkInSub->insub_status === 'Active'){
                                // Upgrade the user to premium if they match the CSV data
                                $user->update([
                                    'is_premium' => true
                                ]);
                            } else {
                                $user->update([
                                    'is_premium' => false
                                ]);
                            }
                            
                            Log::info('User upgraded to premium: ', $user->toArray());
    
                            return true;  // Return true for successful upgrade
                        }
                    }
                }
    
                return false; // Return false if no match found
            } else {
                Log::warning('CSV data is empty or not in the expected format.');
                return false; // Return false if CSV data is not valid
            }
        }
    
        return false; // Return false if no subscription content
    }
    
}
