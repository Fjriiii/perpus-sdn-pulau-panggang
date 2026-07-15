<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $username = env('ADMIN_USERNAME');
        $password = env('ADMIN_PASSWORD');

        if (blank($username) || blank($password)) {
            throw new RuntimeException('ADMIN_USERNAME and ADMIN_PASSWORD must be set before seeding the admin account.');
        }

        Admin::updateOrCreate(
            ['username' => $username],
            ['password' => Hash::make($password)]
        );
    }
}
