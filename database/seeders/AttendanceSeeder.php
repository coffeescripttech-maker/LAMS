<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('attendances')->insert([
            [
                'user_id' => 3,
                'name' => 'John Doe',
                'date' => '2025-02-20',
                'time' => '08:00:00',
                'status' => 'IN',
                'remarks' => 'Present',
                'com_no' => '1',
                'created_at' => now(),
            ],
            [
                'user_id' => 3,
                'name' => 'John Doe',
                'date' => '2025-02-20',
                'time' => '08:00:00',
                'status' => 'OUT',
                'remarks' => 'Present',
                'com_no' => '1',
                'created_at' => now(),
            ]
        ]);
    }
}
