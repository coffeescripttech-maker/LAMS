<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('events')->insert([
            [
                'title'    => 'interest',
                'description'    => "All about nothing",
                'has_image'    => true,
            ],
            [
                'title'    => 'sample',
                'description'    => "All about nothing",
                'has_image'    => false,
            ],
        ]);
    }
}
