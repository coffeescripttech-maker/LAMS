<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if users already exist
        if (DB::table('users')->count() > 0) {
            $this->command->info('Users already exist. Skipping seeder.');
            return;
        }

        DB::table('users')->insert([
            [
                'fname' => 'Jon',
                'mname' => '',
                'lname' => 'Doe',
                'suffix' => '',
                'role' => 'admin',
                'mobile' => '0912312312',
                'is_male' => 1,
                'email' => 'admin@gmail.com',
                'section_id' => null,
                'schoolId' =>
                '123-233-232',
                'verified' => 1,
                'address' => 'sample address',
                'occupation' => 'Assistant',
                'dob' => '1990-01-01',
                'created_at' => Carbon::now('Asia/Singapore'),
                'email_verified_at' => Carbon::now('Asia/Singapore'),
                'password' => Hash::make('password'),
            ],

            [
                'fname' => 'Jen',
                'mname' => '',
                'section_id' => null,
                'lname' => 'Doe',
                'suffix' => '',
                'role' => 'faculty',
                'mobile' => '0912312313',
                'is_male' => 1,
                'email' => 'faculty@gmail.com',
                'schoolId' =>
                '123-233-222',
                'verified' => 1,
                'address' => 'sample address',
                'occupation' => 'Teacher',
                'dob' => '1990-01-01',
                'created_at' => Carbon::now('Asia/Singapore'),
                'email_verified_at' => Carbon::now('Asia/Singapore'),
                'password' => Hash::make('password'),
            ],

            [
                'fname' => 'Kaleb',
                'section_id' => 1,
                'mname' => '',
                'lname' => 'Doe',
                'suffix' => '',
                'role' => 'student',
                'mobile' => '0912342314',
                'is_male' => 1,
                'email' => 'student@gmail.com',
                'schoolId' =>
                '123-235-222',
                'verified' => 1,
                'address' => 'sample address',
                'occupation' => 'N/A',
                'dob' => '1990-01-01',
                'created_at' => Carbon::now('Asia/Singapore'),
                'email_verified_at' => Carbon::now('Asia/Singapore'),
                'password' => Hash::make('password'),
            ],
        ]);
    }
}
