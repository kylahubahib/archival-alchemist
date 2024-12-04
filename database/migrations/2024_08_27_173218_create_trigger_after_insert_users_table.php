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
                        user_id, dashboard_access, users_access, archives_access, 
                        subscriptions_and_billings_access, user_reports_access, 
                        user_feedbacks_access, terms_and_conditions_access, 
                        subscription_plans_access, faqs_access, advanced_access, 
                        can_add, can_edit, can_delete, role
                    )
                    VALUES (
                        NEW.id, TRUE, TRUE, TRUE, TRUE, 
                        TRUE, TRUE, TRUE, TRUE, TRUE, 
                        TRUE, FALSE, FALSE, FALSE, NEW.user_type
                    );
                ELSEIF NEW.user_type = 'admin' THEN
                    INSERT INTO access_controls (
                        user_id, dashboard_access, users_access, archives_access, 
                        subscriptions_and_billings_access, user_reports_access, 
                        user_feedbacks_access, terms_and_conditions_access, 
                        subscription_plans_access, faqs_access, advanced_access, 
                        can_add, can_edit, can_delete, role
                    )
                    VALUES (
                        NEW.id, FALSE, FALSE, FALSE, FALSE, 
                        FALSE, FALSE, FALSE, FALSE, FALSE, 
                        FALSE, TRUE, TRUE, TRUE, NEW.user_type
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
