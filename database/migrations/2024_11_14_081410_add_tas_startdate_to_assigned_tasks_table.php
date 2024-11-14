<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('assigned_tasks', function (Blueprint $table) {
            
            // Check if the column 'task_duedate' exists
            if (!Schema::hasColumn('assigned_tasks', 'task_duedate')) {
                $table->datetime('task_duedate');
            }

            // Check if the column 'task_startdate' exists
            if (!Schema::hasColumn('assigned_tasks', 'task_startdate')) {
                $table->datetime('task_startdate');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assigned_tasks', function (Blueprint $table) {
            $table->dropColumn('task_duedate');
            $table->dropColumn('task_startdate');
        });
    }
};
