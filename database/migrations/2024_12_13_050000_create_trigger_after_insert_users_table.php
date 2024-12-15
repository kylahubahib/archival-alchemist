<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

class CreateTriggerAfterInsertUsersTable extends Migration
{
    public function up(): void
    {
        // Define the trigger SQL
        $sql = <<<SQL
        CREATE TRIGGER after_insert_users_set_access_controls
        AFTER INSERT ON users
        FOR EACH ROW
        BEGIN
            -- use @ prefix to declare a mysql session variale
            -- Check if the DISABLE_ADMIN_INSERTION_TRIGGER variable is set
            IF @DISABLE_ADMIN_INSERTION_TRIGGER IS NULL OR @DISABLE_ADMIN_INSERTION_TRIGGER = FALSE THEN
                IF NEW.user_type = 'superadmin' THEN
                INSERT INTO access_controls (
                        user_id, super_dashboard_access, super_users_access, super_archives_access, 
                        super_subscription_and_billing_access, super_user_reports_access, 
                        super_user_feedbacks_access, super_terms_and_conditions_access, 
                        super_subscription_plans_access, super_faqs_access, super_advanced_access, 
                        ins_students_access, ins_faculties_access, ins_coadmins_access, ins_departments_access, 
                        ins_sections_access, ins_subscription_billing_access, ins_archives_access, 
                        role
                    )
                    VALUES (
                        NEW.id, TRUE, TRUE, TRUE, TRUE, 
                        TRUE, TRUE, TRUE, TRUE, TRUE, 
                        TRUE, FALSE, FALSE, FALSE, FALSE, 
                        FALSE, FALSE, FALSE, NEW.user_type
                    );

                ELSEIF NEW.user_type = 'admin' THEN
                INSERT INTO access_controls (
                        user_id, super_dashboard_access, super_users_access, super_archives_access, 
                        super_subscription_and_billing_access, super_user_reports_access, 
                        super_user_feedbacks_access, super_terms_and_conditions_access, 
                        super_subscription_plans_access, super_faqs_access, super_advanced_access, 
                        ins_students_access, ins_faculties_access, ins_coadmins_access, ins_departments_access, 
                        ins_sections_access, ins_subscription_billing_access, ins_archives_access, 
                        role
                    )
                    VALUES (
                        NEW.id, FALSE, FALSE, FALSE, FALSE, 
                        FALSE, FALSE, FALSE, FALSE, FALSE, 
                        FALSE, TRUE, TRUE, TRUE, TRUE, 
                        TRUE, TRUE, TRUE, NEW.user_type
                    );
                END IF;
            END IF;
        END
        SQL;

        // Execute the SQL to create the trigger
        DB::statement($sql);
    }

    public function down(): void
    {
        // Drop the trigger if the migration is rolled back
        DB::statement('DROP TRIGGER IF EXISTS after_insert_users_set_access_controls');
    }
}
