<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     DB::table('reservations')->insert([
        'faculty_id' => 2,
        'schedule_id' => 1,
        'status' => 'pending',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    }
}
