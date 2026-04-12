#!/usr/bin/env bash

php artisan migrate --force
php artisan storage:link || true
php artisan db:seed --force

# Set proper permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
