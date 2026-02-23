# Laravel Deployment Guide for Render.com

This guide documents the complete deployment process for deploying a Laravel application to Render.com with PostgreSQL database.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Technology Stack](#technology-stack)
- [Local Setup](#local-setup)
- [Deployment Steps](#deployment-steps)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Key Issues & Solutions](#key-issues--solutions)

---

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js and npm
- Git
- Render.com account
- GitHub account

---

## Technology Stack

**Backend:**
- Laravel 11
- PHP 8.2
- PostgreSQL (production)
- SQLite (local development)

**Frontend:**
- Blade Templates
- Tailwind CSS
- Vite
- Bootstrap 5

**Deployment:**
- Docker (Apache + PHP)
- Render.com (hosting)
- PostgreSQL (managed database)

---

## Local Setup

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Setup

```bash
# Create SQLite database file
type nul > database\database.sqlite

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed
```

### 4. Run Locally

```bash
# Start Laravel server
php artisan serve

# In another terminal, start Vite
npm run dev
```

Access the application at `http://localhost:8000`

**Default Credentials:**
- Admin: `admin@gmail.com` / `password`
- Faculty: `faculty@gmail.com` / `password`
- Student: `student@gmail.com` / `password`

---

## Deployment Steps

### Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 3: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - Name: `lams-db`
   - Database: `lams`
   - User: `lams`
   - Region: Choose closest to you
   - Plan: **Free**
4. Click **"Create Database"**
5. Save the connection details (you'll need them later)

### Step 4: Create Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `lams` (or your preferred name)
   - **Environment:** `Docker`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Dockerfile Path:** `./Dockerfile`
   - **Plan:** Free

### Step 5: Configure Environment Variables

In your Render Web Service, go to **Environment** tab and add these variables:

```env
APP_NAME=LAMS
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_KEY_HERE
APP_URL=https://your-app-name.onrender.com
ASSET_URL=https://your-app-name.onrender.com

DB_CONNECTION=pgsql
DB_HOST=<from-postgresql-dashboard>
DB_PORT=5432
DB_DATABASE=lams
DB_USERNAME=<from-postgresql-dashboard>
DB_PASSWORD=<from-postgresql-dashboard>

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_SECURE_COOKIE=false
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_PATH=/

LOG_CHANNEL=errorlog
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

**To generate APP_KEY locally:**
```bash
php artisan key:generate --show
```

### Step 6: Deploy

Click **"Create Web Service"** and Render will automatically:
1. Build your Docker container
2. Run database migrations
3. Deploy your application

First deployment takes 5-10 minutes.

---

## Environment Configuration

### Required Files

**Dockerfile** (already created):
```dockerfile
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev \
    libpq-dev zip unzip nodejs npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Enable Apache modules
RUN a2enmod rewrite headers

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application
COPY . /var/www/html

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN npm install && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/www/html/public

# Configure Apache
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Laravel configuration
RUN echo '<Directory /var/www/html/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n\
\n\
SetEnvIf X-Forwarded-Proto https HTTPS=on' > /etc/apache2/conf-available/laravel.conf

RUN a2enconf laravel

EXPOSE 80

CMD php artisan migrate --force && \
    php artisan storage:link && \
    chmod -R 777 /var/www/html/storage && \
    php artisan config:cache && \
    php artisan route:cache && \
    apache2-foreground
```

**render.yaml** (already created):
```yaml
services:
  - type: web
    name: lams
    runtime: docker
    plan: free
    repo: https://github.com/YOUR_USERNAME/YOUR_REPO
    branch: main
    dockerfilePath: ./Dockerfile
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
      - key: DB_CONNECTION
        value: pgsql
      - key: SESSION_DRIVER
        value: database
      - key: LOG_CHANNEL
        value: errorlog

databases:
  - name: lams-db
    databaseName: lams
    user: lams
    plan: free
```

---

## Key Issues & Solutions

### Issue 1: CSS/JavaScript Not Loading

**Problem:** Static assets return 404 or don't load over HTTPS.

**Solution:**
1. Use Apache instead of `php artisan serve`
2. Force HTTPS URLs in production
3. Set `ASSET_URL` environment variable

**Code Fix (app/Providers/AppServiceProvider.php):**
```php
public function boot(): void
{
    if ($this->app->environment('production')) {
        URL::forceScheme('https');
    }
}
```

---

### Issue 2: 419 CSRF Token Mismatch

**Problem:** All form submissions return "Page Expired" error.

**Root Cause:** Render uses a reverse proxy, and Laravel doesn't trust the proxy headers.

**Solution:**
Configure proxy trust in `bootstrap/app.php`:

```php
$middleware->trustProxies(
    at: '*',
    headers: \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
             \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
             \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
             \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO |
             \Illuminate\Http\Request::HEADER_X_FORWARDED_AWS_ELB
);
```

---

### Issue 3: Login Loop (Session Not Persisting)

**Problem:** Login succeeds but immediately redirects back to login page.

**Root Cause:** `AuthenticateSession` middleware regenerates session ID, but the new session cookie isn't being sent back properly through the proxy.

**Solution:**
Remove problematic middleware from `bootstrap/app.php`:

```php
$middleware->group('web', [
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
    // Removed: AuthenticateSession
    // Removed: Sanctum (from web group)
]);
```

---

### Issue 4: Flash Messages Not Showing

**Problem:** Validation errors and success messages don't appear after form submission.

**Root Cause:** Sanctum middleware in web group was interfering with session flash data.

**Solution:**
Remove Sanctum from web middleware group (keep it only in API group).

---

### Issue 5: CheckRole Middleware Error

**Problem:** Null pointer exception when user is not authenticated.

**Solution:**
Fix middleware to handle null user (app/Http/Middleware/CheckRole.php):

```php
public function handle(Request $request, Closure $next, ...$roles): Response
{
    $user = Auth::user();

    // If user is not authenticated, redirect to login
    if (!$user) {
        return redirect('/login');
    }

    // Check if the user has the required role and is verified
    if (in_array($user->role, $roles) && $user->email_verified_at != null) {
        return $next($request);
    }

    // If user doesn't have the right role, redirect to their dashboard
    return redirect("/$user->role/dashboard");
}
```

---

### Issue 6: Database Seeder Duplicate Errors

**Problem:** Redeployment fails because seeder tries to insert duplicate users.

**Solution:**
Add duplicate check in seeder (database/seeders/UsersSeeder.php):

```php
public function run(): void
{
    // Check if users already exist
    if (DB::table('users')->count() > 0) {
        $this->command->info('Users already exist. Skipping seeder.');
        return;
    }

    DB::table('users')->insert([
        // ... user data
    ]);
}
```

---

## Troubleshooting

### Check Logs

View logs in Render Dashboard:
1. Go to your web service
2. Click **"Logs"** tab
3. Look for errors during deployment or runtime

### Common Issues

**App not loading:**
- Check if deployment succeeded
- Verify environment variables are set
- Check logs for errors

**Database connection failed:**
- Verify PostgreSQL credentials
- Check if database is running
- Ensure `DB_CONNECTION=pgsql`

**Session issues:**
- Clear browser cookies
- Check `SESSION_DRIVER=database`
- Verify sessions table exists

**Assets not loading:**
- Check `APP_URL` and `ASSET_URL` are set
- Verify HTTPS is forced in AppServiceProvider
- Check Apache configuration

### Debug Routes

Test routes added for debugging (remove in production):

```php
// Test session persistence
GET /test-session

// Test flash data
GET /test-flash
```

---

## Production Checklist

Before going live:

- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_ENV=production`
- [ ] Generate unique `APP_KEY`
- [ ] Configure proper `APP_URL`
- [ ] Set up PostgreSQL database
- [ ] Configure all environment variables
- [ ] Remove debug routes
- [ ] Test all authentication flows
- [ ] Test form submissions
- [ ] Verify HTTPS is working
- [ ] Check all static assets load
- [ ] Test on different browsers
- [ ] Set up database backups (Render provides this)

---

## Important Notes

### Free Tier Limitations

- **Web Service:** Sleeps after 15 minutes of inactivity (first request takes ~30 seconds to wake up)
- **Database:** 1GB storage, 97 hours/month uptime
- **Build Time:** Limited build minutes per month

### Database Persistence

- PostgreSQL data persists across deployments
- Docker container is ephemeral (resets on each deploy)
- Never store files in the container (use external storage like S3)

### Security

- Always use HTTPS in production
- Keep `APP_DEBUG=false` in production
- Use strong database passwords
- Regularly update dependencies
- Enable CSRF protection (already configured)

---

## Useful Commands

### Local Development

```bash
# Clear all caches
php artisan optimize:clear

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Seed database
php artisan db:seed

# Generate app key
php artisan key:generate
```

### Deployment

```bash
# Commit changes
git add .
git commit -m "Your message"
git push origin main

# Render will automatically deploy
```

---

## Support & Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Render Documentation](https://render.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Summary

This deployment successfully addresses all common Laravel deployment issues on Render.com:

✅ Static asset serving with Apache  
✅ HTTPS URL generation  
✅ Proxy header trust  
✅ Session persistence  
✅ CSRF protection  
✅ Flash message handling  
✅ Database migrations  
✅ Environment configuration  

Your Laravel application is now production-ready on Render.com! 🚀
