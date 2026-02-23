<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sections')->insert([
            [
                'yr_lvl' => "1st Year",
                'name' => 'Section 1',
                'is_ecoast' => 1,
            ],
            [
                'yr_lvl' => "1st Year",
                'name' => 'Section 2',
                'is_ecoast' => 0,
            ],
            [
                'yr_lvl' => "1st Year",
                'name' => 'Section 3',
                'is_ecoast' => 1,
            ],
        ]);
    }
}
