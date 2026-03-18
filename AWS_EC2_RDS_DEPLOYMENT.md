# AWS EC2 + RDS Deployment Guide - Complete Step-by-Step

## Overview

This guide will deploy your Laravel LAMS application on:
- **AWS EC2** - Ubuntu server for Laravel + Python API
- **AWS RDS** - Managed PostgreSQL database
- **Route 53** - DNS management (optional)
- **Certificate Manager** - Free SSL certificates

**Estimated Cost:** $20-50/month  
**Setup Time:** 2-4 hours  
**Difficulty:** Advanced

---

## Architecture

```
                    ┌─────────────────┐
                    │   Internet      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Route 53 (DNS) │
                    │  yourdomain.com │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  EC2 Instance   │
                    │  Ubuntu 22.04   │
                    │  - Nginx        │
                    │  - PHP 8.2      │
                    │  - Laravel      │
                    │  - Python API   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  RDS PostgreSQL │
                    │  (Managed DB)   │
                    └─────────────────┘
```

---

## Part 1: Create RDS Database

### Step 1: Go to RDS Console

1. Login to AWS Console: https://console.aws.amazon.com
2. Search for **"RDS"** in the top search bar
3. Click **"RDS"** to open the service

### Step 2: Create Database

1. Click **"Create database"** button
2. Choose database creation method:
   - Select **"Standard create"**

### Step 3: Engine Options

- **Engine type:** PostgreSQL
- **Version:** PostgreSQL 15.x (latest)

### Step 4: Templates

- Select **"Free tier"** (if eligible) OR **"Production"**

### Step 5: Settings

```
DB instance identifier: lams-db
Master username: lamsadmin
Master password: [Create a strong password - save this!]
Confirm password: [Same password]
```

**⚠️ IMPORTANT:** Save your password securely!

### Step 6: Instance Configuration

**Free Tier:**
- DB instance class: `db.t3.micro` (1 vCPU, 1 GB RAM)

**Production:**
- DB instance class: `db.t3.small` (2 vCPU, 2 GB RAM)

### Step 7: Storage

```
Storage type: General Purpose SSD (gp3)
Allocated storage: 20 GB
Enable storage autoscaling: Yes
Maximum storage threshold: 100 GB
```

### Step 8: Connectivity

```
Compute resource: Don't connect to an EC2 compute resource (we'll do this manually)
VPC: Default VPC
Subnet group: default
Public access: No
VPC security group: Create new
New VPC security group name: lams-db-sg
Availability Zone: No preference
```

### Step 9: Database Authentication

- Select **"Password authentication"**

### Step 10: Additional Configuration

```
Initial database name: lams
DB parameter group: default
Option group: default
Backup retention period: 7 days
Enable encryption: Yes (recommended)
Enable Enhanced monitoring: No (to save costs)
Enable auto minor version upgrade: Yes
```

### Step 11: Create Database

1. Review all settings
2. Click **"Create database"**
3. Wait 5-10 minutes for database to be created
4. Status will change from "Creating" to "Available"

### Step 12: Note Database Details

Once created, click on your database and note:

```
Endpoint: lams-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
Port: 5432
Master username: lamsadmin
Database name: lams
```

**Save these details - you'll need them later!**

---

## Part 2: Create EC2 Instance

### Step 1: Go to EC2 Console

1. Search for **"EC2"** in AWS Console
2. Click **"EC2"** to open the service
3. Click **"Launch instance"** button

### Step 2: Name and Tags

```
Name: lams-app-server
```

### Step 3: Application and OS Images (AMI)

```
Quick Start: Ubuntu
AMI: Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
Architecture: 64-bit (x86)
```

### Step 4: Instance Type

**Free Tier:**
- `t2.micro` (1 vCPU, 1 GB RAM) - Free tier eligible

**Recommended for Production:**
- `t3.small` (2 vCPU, 2 GB RAM) - ~$15/month
- `t3.medium` (2 vCPU, 4 GB RAM) - ~$30/month

### Step 5: Key Pair (Login)

1. Click **"Create new key pair"**
2. Key pair name: `lams-key`
3. Key pair type: RSA
4. Private key file format: `.pem` (for Mac/Linux) or `.ppk` (for Windows/PuTTY)
5. Click **"Create key pair"**
6. **⚠️ SAVE THE FILE!** You can't download it again!

### Step 6: Network Settings

Click **"Edit"** and configure:

```
VPC: Default VPC
Subnet: No preference
Auto-assign public IP: Enable
Firewall (security groups): Create security group
Security group name: lams-web-sg
Description: Security group for LAMS web server
```

**Inbound Security Group Rules:**

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web traffic |

### Step 7: Configure Storage

```
Volume type: gp3 (General Purpose SSD)
Size: 20 GB (minimum) or 30 GB (recommended)
Delete on termination: Yes
```

### Step 8: Advanced Details (Optional)

Leave as default for now.

### Step 9: Launch Instance

1. Review all settings in the Summary panel
2. Click **"Launch instance"**
3. Wait 2-3 minutes for instance to start
4. Status will change to "Running"

### Step 10: Note Instance Details

Click on your instance and note:

```
Instance ID: i-xxxxxxxxxxxxxxxxx
Public IPv4 address: 54.xxx.xxx.xxx
Public IPv4 DNS: ec2-54-xxx-xxx-xxx.compute-1.amazonaws.com
```

---

## Part 3: Configure Security Groups

### Step 1: Allow EC2 to Access RDS

1. Go to **RDS Console**
2. Click on your database: `lams-db`
3. Click on the **VPC security group** link (e.g., `lams-db-sg`)
4. Click **"Edit inbound rules"**
5. Click **"Add rule"**

```
Type: PostgreSQL
Protocol: TCP
Port: 5432
Source: Custom
Source value: [Select the lams-web-sg security group]
Description: Allow EC2 to access RDS
```

6. Click **"Save rules"**

---

## Part 4: Connect to EC2 Instance

### For Windows Users (Using PuTTY):

1. Download PuTTY: https://www.putty.org/
2. Convert `.pem` to `.ppk`:
   - Open PuTTYgen
   - Load your `.pem` file
   - Click "Save private key"
   - Save as `lams-key.ppk`
3. Open PuTTY:
   - Host Name: `ubuntu@YOUR_EC2_PUBLIC_IP`
   - Port: 22
   - Connection → SSH → Auth → Browse for your `.ppk` file
   - Click "Open"

### For Mac/Linux Users:

```bash
# Set permissions on key file
chmod 400 lams-key.pem

# Connect to EC2
ssh -i lams-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Replace `YOUR_EC2_PUBLIC_IP` with your actual IP address!**

---

## Part 5: Install Software on EC2

Once connected via SSH, run these commands:

### Step 1: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Step 3: Install PHP 8.2

```bash
# Add PHP repository
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP and extensions
sudo apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-common \
    php8.2-mysql php8.2-pgsql php8.2-zip php8.2-gd php8.2-mbstring \
    php8.2-curl php8.2-xml php8.2-bcmath php8.2-intl php8.2-redis

# Verify installation
php -v
```

### Step 4: Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

### Step 5: Install Node.js and npm

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### Step 6: Install Git

```bash
sudo apt install -y git
git --version
```

### Step 7: Install PostgreSQL Client

```bash
sudo apt install -y postgresql-client
```

### Step 8: Install Python for Fingerprint API

```bash
sudo apt install -y python3 python3-pip python3-venv
sudo apt install -y libgl1 libglib2.0-0 libsm6 libxext6 libxrender1 libgomp1
python3 --version
```

---

## Part 6: Deploy Laravel Application

### Step 1: Clone Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
sudo git clone https://github.com/coffeescripttech-maker/LAMS.git lams

# Change ownership
sudo chown -R www-data:www-data /var/www/lams
sudo chown -R ubuntu:ubuntu /var/www/lams
```

### Step 2: Install Dependencies

```bash
cd /var/www/lams

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node dependencies
npm install

# Build assets
npm run build
```

### Step 3: Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit environment file
nano .env
```

**Update these values:**

```env
APP_NAME=LAMS
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://YOUR_EC2_PUBLIC_IP

DB_CONNECTION=pgsql
DB_HOST=lams-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_DATABASE=lams
DB_USERNAME=lamsadmin
DB_PASSWORD=YOUR_RDS_PASSWORD

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_SECURE_COOKIE=false

CACHE_DRIVER=file
QUEUE_CONNECTION=sync

LOG_CHANNEL=stack
LOG_LEVEL=error

FINGERPRINT_API_URL=http://127.0.0.1:7000
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Generate Application Key

```bash
php artisan key:generate
```

### Step 5: Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/lams
sudo chmod -R 755 /var/www/lams/storage
sudo chmod -R 755 /var/www/lams/bootstrap/cache
```

### Step 6: Run Migrations

```bash
php artisan migrate --force
php artisan db:seed --force
```

### Step 7: Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

---

## Part 7: Configure Nginx

### Step 1: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/lams
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name YOUR_EC2_PUBLIC_IP;
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
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Increase upload size
    client_max_body_size 20M;
}
```

**Replace `YOUR_EC2_PUBLIC_IP` with your actual IP!**

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 2: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/lams /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 3: Configure PHP-FPM

```bash
# Edit PHP-FPM configuration
sudo nano /etc/php/8.2/fpm/php.ini
```

Find and update these values:
```ini
upload_max_filesize = 20M
post_max_size = 20M
memory_limit = 256M
max_execution_time = 300
```

**Save and restart:**

```bash
sudo systemctl restart php8.2-fpm
```

---

## Part 8: Deploy Python Fingerprint API

### Step 1: Setup Python Environment

```bash
cd /var/www/lams/python-scanner

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Deactivate
deactivate
```

### Step 2: Create Systemd Service

```bash
sudo nano /etc/systemd/system/fingerprint-api.service
```

**Paste this:**

```ini
[Unit]
Description=LAMS Fingerprint API
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/lams/python-scanner
Environment="PATH=/var/www/lams/python-scanner/venv/bin"
ExecStart=/var/www/lams/python-scanner/venv/bin/gunicorn --bind 127.0.0.1:7000 --workers 2 --timeout 120 index:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Save and enable:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable fingerprint-api
sudo systemctl start fingerprint-api

# Check status
sudo systemctl status fingerprint-api
```

---

## Part 9: Test Your Application

### Step 1: Access Your Application

Open browser and go to:
```
http://YOUR_EC2_PUBLIC_IP
```

You should see your LAMS application!

### Step 2: Test Login

```
Email: admin@gmail.com
Password: password
```

### Step 3: Check Logs

```bash
# Laravel logs
tail -f /var/www/lams/storage/logs/laravel.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# Python API logs
sudo journalctl -u fingerprint-api -f
```

---

## Part 10: Setup Domain and SSL (Optional)

### Step 1: Allocate Elastic IP

1. Go to EC2 Console
2. Click **"Elastic IPs"** in left menu
3. Click **"Allocate Elastic IP address"**
4. Click **"Allocate"**
5. Select the new IP → Actions → **"Associate Elastic IP address"**
6. Select your instance → Click **"Associate"**

**Note your Elastic IP - this won't change even if you restart the instance!**

### Step 2: Configure Domain (Route 53 or External)

**If using Route 53:**
1. Go to Route 53 Console
2. Create hosted zone for your domain
3. Create A record pointing to your Elastic IP

**If using external DNS (GoDaddy, Namecheap, etc.):**
1. Go to your domain registrar
2. Add A record:
   - Type: A
   - Name: @ (or subdomain)
   - Value: Your Elastic IP
   - TTL: 3600

### Step 3: Install SSL Certificate

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS: Yes
```

### Step 4: Update Laravel .env

```bash
nano /var/www/lams/.env
```

Change:
```env
APP_URL=https://yourdomain.com
SESSION_SECURE_COOKIE=true
```

```bash
php artisan config:cache
```

### Step 5: Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Enable auto-renewal (already enabled by default)
sudo systemctl enable certbot.timer
```

---

## Part 11: Maintenance and Monitoring

### Update Application

```bash
cd /var/www/lams
git pull origin main
composer install --no-dev --optimize-autoloader
npm install && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl restart php8.2-fpm
sudo systemctl restart fingerprint-api
```

### Monitor Resources

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top

# Check services
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status fingerprint-api
```

### Backup Database

```bash
# Manual backup
pg_dump -h lams-db.xxxxxxxxx.us-east-1.rds.amazonaws.com \
    -U lamsadmin -d lams > backup_$(date +%Y%m%d).sql

# Restore backup
psql -h lams-db.xxxxxxxxx.us-east-1.rds.amazonaws.com \
    -U lamsadmin -d lams < backup_20260223.sql
```

---

## Troubleshooting

### Issue: Can't connect to RDS

```bash
# Test connection
psql -h YOUR_RDS_ENDPOINT -U lamsadmin -d lams

# Check security group allows EC2 IP
```

### Issue: 502 Bad Gateway

```bash
# Check PHP-FPM
sudo systemctl status php8.2-fpm
sudo systemctl restart php8.2-fpm

# Check Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Issue: Permission Denied

```bash
sudo chown -R www-data:www-data /var/www/lams
sudo chmod -R 755 /var/www/lams/storage
sudo chmod -R 755 /var/www/lams/bootstrap/cache
```

### Issue: Python API Not Working

```bash
# Check service
sudo systemctl status fingerprint-api

# View logs
sudo journalctl -u fingerprint-api -n 50

# Restart service
sudo systemctl restart fingerprint-api
```

---

## Cost Breakdown

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| EC2 t3.small | 2 vCPU, 2 GB RAM | ~$15 |
| RDS db.t3.micro | 1 vCPU, 1 GB RAM, 20 GB | ~$15 |
| EBS Storage | 30 GB | ~$3 |
| Data Transfer | ~10 GB | ~$1 |
| **Total** | | **~$34/month** |

---

## Summary

✅ RDS PostgreSQL database created  
✅ EC2 instance launched and configured  
✅ Laravel application deployed  
✅ Python fingerprint API running  
✅ Nginx web server configured  
✅ SSL certificate installed (optional)  
✅ Domain configured (optional)  

Your LAMS application is now running on AWS with full control! 🚀

**Access your app at:** `http://YOUR_EC2_PUBLIC_IP` or `https://yourdomain.com`
