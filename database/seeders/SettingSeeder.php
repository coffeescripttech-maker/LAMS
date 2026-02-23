<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('settings')->insert([
            [
                'lab_name'    => 'BSIT LABORATORY',
                'available_slots'    => "1,2,3,4,5,6,7,8,9,10",
                'open_hour'    => '08:00',
                'close_hour'    => '17:00',
                'maintainance_slots'    => "11,12,13",
            ],
        ]);
    }
}
