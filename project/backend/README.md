# Django Backend - Theme Manager

Django REST API backend for the Generic Super Admin Theme Manager.

## Quick Start

### 1. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

### 2. Start with Docker

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL on port 5432
- Start Django backend on port 8000
- Run migrations automatically
- Collect static files

### 3. Create Super Admin

```bash
docker-compose exec backend python manage.py createsuperuser
```

### 4. Enable Super Admin Access

1. Go to http://localhost:8000/admin/
2. Login with superuser credentials
3. Navigate to Users
4. Edit your user
5. Check "Is super admin" checkbox
6. Save

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Get JWT tokens
- `POST /api/auth/refresh/` - Refresh access token

### Organizations
- `GET /api/organizations/` - List organizations
- `POST /api/organizations/` - Create organization
- `GET /api/organizations/{id}/` - Get organization
- `PUT /api/organizations/{id}/` - Update organization
- `DELETE /api/organizations/{id}/` - Delete organization
- `POST /api/organizations/{id}/generate-theme/` - Generate ZIP

## Development Commands

```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Make migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic
```

## Database Models

### User (extends AbstractUser)
- `is_super_admin`: Boolean

### Organization
- `name`: CharField(255)
- `description`: TextField
- `app_title`: CharField(255)
- `browser_title`: CharField(255)
- `primary_color`: CharField(7)
- `secondary_color`: CharField(7)
- `text_color`: CharField(7)
- `font_family`: CharField(255)
- `logo`: ImageField
- `favicon`: ImageField
- `banner`: ImageField
- `config_json`: JSONField
- `created_at`: DateTimeField
- `updated_at`: DateTimeField

### ThemeHistory
- `organization`: ForeignKey
- `zip_file`: FileField
- `version`: CharField(50)
- `created_at`: DateTimeField

## Environment Variables

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_NAME=theme_manager_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=db
DATABASE_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Testing

```bash
docker-compose exec backend python manage.py test
```

## Production

For production deployment:

1. Set `DEBUG=False`
2. Update `SECRET_KEY` with a strong random key
3. Set proper `ALLOWED_HOSTS`
4. Configure `CORS_ALLOWED_ORIGINS`
5. Use environment-specific database credentials
6. Set up proper media file storage (S3, etc.)

## Logs

```bash
# View backend logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f db
```

## Troubleshooting

**Database connection issues:**
```bash
docker-compose down
docker-compose up --build
```

**Permission errors on media files:**
```bash
docker-compose exec backend chmod -R 755 media/
```

**Reset database:**
```bash
docker-compose down -v
docker-compose up --build
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```
