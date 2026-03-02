# Deployment Guide

Step-by-step guide for deploying the Generic Super Admin Theme Manager to production.

## Prerequisites

- Server with Docker and Docker Compose installed
- Domain name pointed to your server
- SSL certificate (Let's Encrypt recommended)
- Git installed on server

## Option 1: Docker Deployment (Recommended)

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd project
```

### Step 2: Configure Backend

```bash
cd backend
cp .env.example .env
nano .env
```

Update production settings:

```env
SECRET_KEY=<generate-strong-random-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com

DATABASE_NAME=theme_manager_db
DATABASE_USER=theme_admin
DATABASE_PASSWORD=<strong-database-password>
DATABASE_HOST=db
DATABASE_PORT=5432

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Generate a secure SECRET_KEY:
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### Step 3: Start Backend Services

```bash
docker-compose up -d --build
```

### Step 4: Create Super Admin

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Step 5: Enable Super Admin in Django Admin

1. Access Django admin at https://yourdomain.com:8000/admin/
2. Login with superuser credentials
3. Go to Users, edit your user
4. Check "Is super admin"
5. Save

### Step 6: Build Frontend

```bash
cd ..
npm install
npm run build
```

### Step 7: Configure Web Server (Nginx)

Create Nginx configuration:

```nginx
# /etc/nginx/sites-available/theme-manager

# Frontend
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/theme-manager/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /media/ {
        alias /path/to/project/backend/media/;
    }

    location /static/ {
        alias /path/to/project/backend/staticfiles/;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/theme-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 9: Copy Frontend Build

```bash
sudo mkdir -p /var/www/theme-manager
sudo cp -r dist/* /var/www/theme-manager/
sudo chown -R www-data:www-data /var/www/theme-manager
```

---

## Option 2: Manual Deployment (Without Docker)

### Backend Setup

#### 1. Install System Dependencies

```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip postgresql postgresql-contrib nginx
```

#### 2. Create Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE theme_manager_db;
CREATE USER theme_admin WITH PASSWORD 'strong-password';
ALTER ROLE theme_admin SET client_encoding TO 'utf8';
ALTER ROLE theme_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE theme_admin SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE theme_manager_db TO theme_admin;
\q
```

#### 3. Setup Python Environment

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 4. Configure Environment

```bash
cp .env.example .env
nano .env
```

Update with production settings (same as Docker option).

#### 5. Run Migrations

```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

#### 6. Setup Gunicorn Service

Create `/etc/systemd/system/theme-manager.service`:

```ini
[Unit]
Description=Theme Manager Django App
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/project/backend
Environment="PATH=/path/to/project/backend/venv/bin"
ExecStart=/path/to/project/backend/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 dashboard.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl start theme-manager
sudo systemctl enable theme-manager
```

### Frontend Setup

Follow steps 6-9 from Option 1.

---

## Post-Deployment Checklist

- [ ] Backend is running on port 8000
- [ ] PostgreSQL database is created and accessible
- [ ] Super admin user is created with `is_super_admin=True`
- [ ] Frontend is built and served by Nginx
- [ ] SSL certificate is installed and working
- [ ] CORS is properly configured
- [ ] Media files are accessible
- [ ] Static files are served correctly
- [ ] API endpoints are accessible
- [ ] Login functionality works
- [ ] Organization creation works
- [ ] Theme ZIP generation works

---

## Monitoring and Maintenance

### View Logs

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f db
```

**Systemd:**
```bash
sudo journalctl -u theme-manager -f
```

**Nginx:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup Database

**Docker:**
```bash
docker-compose exec db pg_dump -U postgres theme_manager_db > backup_$(date +%Y%m%d).sql
```

**Manual:**
```bash
sudo -u postgres pg_dump theme_manager_db > backup_$(date +%Y%m%d).sql
```

### Restore Database

**Docker:**
```bash
docker-compose exec -T db psql -U postgres theme_manager_db < backup.sql
```

**Manual:**
```bash
sudo -u postgres psql theme_manager_db < backup.sql
```

### Update Application

```bash
git pull origin main

# Backend
cd backend
docker-compose down
docker-compose up -d --build
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py collectstatic --noinput

# Frontend
cd ..
npm install
npm run build
sudo cp -r dist/* /var/www/theme-manager/
```

---

## Security Recommendations

1. **Use strong passwords** for database and super admin accounts
2. **Keep SECRET_KEY secure** and never commit it to version control
3. **Enable firewall** and only open necessary ports (80, 443)
4. **Regular backups** of database and media files
5. **Keep dependencies updated** with security patches
6. **Use SSL/HTTPS** for all traffic
7. **Implement rate limiting** on API endpoints
8. **Monitor logs** for suspicious activity
9. **Set up automatic security updates** for the server
10. **Use environment variables** for all sensitive configuration

---

## Performance Optimization

1. **Enable Gzip compression** in Nginx
2. **Set up CDN** for static assets
3. **Configure database connection pooling**
4. **Enable Django caching** with Redis
5. **Optimize images** before upload
6. **Use database indexes** on frequently queried fields
7. **Enable HTTP/2** in Nginx
8. **Set up monitoring** with tools like Prometheus/Grafana

---

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Restart services
docker-compose restart

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec backend python manage.py dbshell
```

### Frontend Not Loading

```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx is running
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### CORS Errors

Update `backend/.env`:
```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

Restart backend:
```bash
docker-compose restart backend
```

---

## Support

For production support:
1. Check application logs
2. Review Nginx error logs
3. Verify database connectivity
4. Check disk space: `df -h`
5. Check memory usage: `free -m`
6. Monitor CPU: `top`

For critical issues, contact your system administrator.
