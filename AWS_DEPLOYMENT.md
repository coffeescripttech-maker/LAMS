# AWS Deployment Guide for Laravel LAMS

## Overview

This guide covers deploying the LAMS application to AWS using different services.

---

## Option 1: AWS Lightsail (Recommended for Beginners)

**Cost:** $10-20/month  
**Complexity:** ⭐⭐ (Low)  
**Best for:** Small to medium projects

### Prerequisites

- AWS Account
- Credit card for billing
- SSH client (PuTTY for Windows or Terminal for Mac/Linux)

### Step 1: Create Lightsail Instance

1. Go to https://lightsail.aws.amazon.com
2. Click **"Create instance"**
3. Select:
   - **Instance location:** Choose closest region
   - **Platform:** Linux/Unix
   - **Blueprint:** OS Only → Ubuntu 22.04 LTS
   - **Instance plan:** $10/month (1 GB RAM, 40 GB SSD)
4. Name your instance: `lams-app`
5. Click **"Create instance"**

### Step 2: Connect to Instance

1. Wait for instance to start (2-3 minutes)
2. Click **"Connect using SSH"** button
3. You'll see a terminal window

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-common \
    php8.2-mysql php8.2-pgsql php8.2-zip php8.2-gd php8.2-mbstring \
    php8.2-curl php8.2-xml php8.2-bcmath php8.2-intl

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Python (for fingerprint API)
sudo apt install -y python3 python3-pip python3-venv
```

### Step 4: Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE lams;
CREATE USER lams WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE lams TO lams;
\q
```

### Step 5: Clone Your Repository

```bash
# Install Git
sudo apt install -y git

# Clone repository
cd /var/www
sudo git clone https://github.com/coffeescripttech-maker/LAMS.git lams
cd lams

# Set permissions
sudo chown -R www-data:www-data /var/www/lams
sudo chmod -R 755 /var/www/lams/storage
sudo chmod -R 755 /var/www/lams/bootstrap/cache
```

### Step 6: Configure Laravel

```bash
# Copy environment file
sudo cp .env.example .env

# Edit environment file
sudo nano .env
```

Update these values:
```env
APP_NAME=LAMS
APP_ENV=production
APP_DEBUG=false
APP_URL=http://YOUR_LIGHTSAIL_IP

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=lams
DB_USERNAME=lams
DB_PASSWORD=your_secure_password

SESSION_DRIVER=database
CACHE_DRIVER=file
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

```bash
# Install dependencies
sudo -u www-data composer install --no-dev --optimize-autoloader
sudo -u www-data npm install
sudo -u www-data npm run build

# Generate app key
sudo -u www-data php artisan key:generate

# Run migrations
sudo -u www-data php artisan migrate --force
sudo -u www-data php artisan db:seed --force

# Cache configuration
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache
```

### Step 7: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/lams
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_LIGHTSAIL_IP;
    root /var/www/lams/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Save and exit.

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/lams /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm
```

### Step 8: Setup Python Fingerprint API

```bash
# Create virtual environment
cd /var/www/lams/python-scanner
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create systemd service
sudo nano /etc/systemd/system/fingerprint-api.service
```

Paste this:
```ini
[Unit]
Description=LAMS Fingerprint API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/lams/python-scanner
Environment="PATH=/var/www/lams/python-scanner/venv/bin"
ExecStart=/var/www/lams/python-scanner/venv/bin/gunicorn --bind 127.0.0.1:7000 --workers 2 index:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Save and exit.

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl enable fingerprint-api
sudo systemctl start fingerprint-api

# Check status
sudo systemctl status fingerprint-api
```

### Step 9: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### Step 10: Get Your IP Address

In Lightsail dashboard, you'll see your **Public IP address**.

Visit: `http://YOUR_IP_ADDRESS`

### Step 11: Setup Domain (Optional)

1. In Lightsail, go to **Networking** tab
2. Click **"Create static IP"**
3. Attach to your instance
4. Update your domain's DNS:
   - Type: A Record
   - Name: @ (or subdomain)
   - Value: Your static IP

### Step 12: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Option 2: AWS EC2 + RDS (Advanced)

**Cost:** $20-50/month  
**Complexity:** ⭐⭐⭐⭐ (High)

### Architecture

```
┌─────────────────┐
│   Route 53      │ (DNS)
│   (Optional)    │
└────────┬────────┘
         │
┌────────▼────────┐
│  Load Balancer  │ (Optional)
│   (ALB/ELB)     │
└────────┬────────┘
         │
┌────────▼────────┐
│   EC2 Instance  │ (Laravel + Python)
│   Ubuntu 22.04  │
└────────┬────────┘
         │
┌────────▼────────┐
│   RDS Database  │ (PostgreSQL)
│   (Managed)     │
└─────────────────┘
```

### Quick Steps

1. **Create RDS PostgreSQL Database**
   - Go to RDS console
   - Create database → PostgreSQL
   - Free tier eligible
   - Note endpoint and credentials

2. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04
   - Instance type: t2.micro (free tier) or t2.small
   - Security group: Allow ports 22, 80, 443
   - Create key pair for SSH

3. **Connect and Setup**
   - Follow same steps as Lightsail (Step 3-8)
   - Use RDS endpoint for DB_HOST in .env

4. **Configure Security Groups**
   - EC2 security group: Allow inbound 80, 443, 22
   - RDS security group: Allow inbound 5432 from EC2

---

## Option 3: AWS Elastic Beanstalk (Managed)

**Cost:** $15-30/month  
**Complexity:** ⭐⭐⭐ (Medium)

### Prerequisites

```bash
# Install EB CLI
pip install awsebcli
```

### Deployment Steps

```bash
# Initialize EB
cd /path/to/your/project
eb init

# Select:
# - Region
# - Application name: lams
# - Platform: PHP 8.2
# - CodeCommit: No

# Create environment
eb create lams-prod

# Deploy
eb deploy

# Open in browser
eb open
```

### Configuration

Create `.ebextensions/01_packages.config`:
```yaml
packages:
  yum:
    postgresql-devel: []
    
option_settings:
  aws:elasticbeanstalk:container:php:phpini:
    document_root: /public
    memory_limit: 256M
```

---

## Cost Comparison

| Service | Monthly Cost | Setup Time | Maintenance |
|---------|-------------|------------|-------------|
| **Lightsail** | $10-20 | 1-2 hours | Low |
| **EC2 + RDS** | $20-50 | 2-4 hours | Medium |
| **Elastic Beanstalk** | $15-30 | 30 min | Low |
| **Render (Current)** | $0-14 | 15 min | Very Low |

---

## Recommendation

**For your project, I recommend:**

1. **Stay on Render** if budget is tight ($0-14/month)
2. **Use Lightsail** if you want AWS ($10/month)
3. **Use EC2 + RDS** if you need more control ($20+/month)

---

## Migration from Render to AWS

If you want to migrate:

1. **Export database from Render**
   ```bash
   # Get database URL from Render
   pg_dump DATABASE_URL > backup.sql
   ```

2. **Import to AWS**
   ```bash
   psql -h YOUR_RDS_ENDPOINT -U lams -d lams < backup.sql
   ```

3. **Update DNS**
   - Point domain to AWS IP
   - Wait for propagation (24-48 hours)

---

## Troubleshooting

### Issue: Permission Denied

```bash
sudo chown -R www-data:www-data /var/www/lams
sudo chmod -R 755 /var/www/lams/storage
```

### Issue: 502 Bad Gateway

```bash
# Check PHP-FPM
sudo systemctl status php8.2-fpm
sudo systemctl restart php8.2-fpm
```

### Issue: Database Connection Failed

```bash
# Check PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"
```

---

## Support

For AWS-specific issues:
- AWS Documentation: https://docs.aws.amazon.com
- AWS Support: https://console.aws.amazon.com/support

For Laravel issues:
- Laravel Docs: https://laravel.com/docs
- Your existing DEPLOYMENT.md file

---

## Summary

AWS deployment gives you more control but requires more setup and maintenance. 

**Current Setup (Render):**
- ✅ Free tier available
- ✅ Auto-scaling
- ✅ Auto-SSL
- ✅ Easy deployment
- ✅ Already working!

**AWS Benefits:**
- More control
- Better for large scale
- More AWS service integrations
- Potentially better performance

Choose based on your needs and budget! 🚀
