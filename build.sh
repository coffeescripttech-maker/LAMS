#!/usr/bin/env bash
# exit on error
set -o errexit

composer install --no-dev --optimize-autoloader
npm install
npm run build

# Create storage symlink
php artisan storage:link || true

# Create necessary directories
mkdir -p storage/app/public/fingerprints
mkdir -p storage/app/public/credentials
mkdir -p storage/app/public/events

php artisan config:cache
php artisan route:cache
php artisan view:cache
