<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('schedules')->insert([
            'start_time' => '08:00:00',
            'end_time' => '17:00:00',
            'date' => '2025-02-20',
            'book_by' => 2,
        ]);
    }
}
