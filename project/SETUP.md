# Generic Super Admin Theme Manager - Setup Guide

Complete guide for setting up and running the Generic Super Admin Theme Manager application.

## Overview

This application allows super admins to manage organizations and generate theme ZIP packages that control application UI branding. The system consists of:

- **Backend**: Django + Django REST Framework + PostgreSQL
- **Frontend**: React + TypeScript + Material UI
- **Deployment**: Docker + Docker Compose

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 1.29 or higher
- **Node.js**: Version 18 or higher (for frontend development)
- **npm**: Version 9 or higher

---

## Project Structure

```
project/
├── backend/                    # Django backend
│   ├── dashboard/              # Main Django project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── core/                   # Core app with models, views, etc.
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── admin.py
│   │   └── urls.py
│   ├── media/                  # Uploaded files
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── .env.example
├── src/                        # React frontend
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── App.tsx
└── package.json
```

---

## Backend Setup (Django)

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
SECRET_KEY=your-super-secret-key-change-this
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_NAME=theme_manager_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=db
DATABASE_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 3: Start Backend with Docker

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Build Django backend container
- Run migrations
- Collect static files
- Start Gunicorn server on port 8000

### Step 4: Create Super Admin User

Open a new terminal and run:

```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to create a super admin user with:
- Username
- Email
- Password

**IMPORTANT**: Make sure to set `is_super_admin=True` for this user in Django admin.

### Step 5: Access Django Admin

Open your browser and navigate to:
- Django Admin: http://localhost:8000/admin/

Login with the superuser credentials you just created.

**Enable Super Admin Access**:
1. Go to Users section
2. Click on your user
3. Check the "Is super admin" checkbox
4. Save

---

## Frontend Setup (React)

### Step 1: Install Dependencies

From the project root directory:

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The frontend will start on http://localhost:5173

---

## Using the Application

### Step 1: Login

1. Open http://localhost:5173
2. Login with your super admin credentials
3. You'll be redirected to the dashboard

### Step 2: Create an Organization

1. Click "Add Organization" in the sidebar
2. Fill in the organization details:
   - **Name**: Organization name
   - **Description**: Optional description
   - **App Title**: Title shown in the application
   - **Browser Title**: Title shown in browser tab
   - **Font Family**: CSS font family
   - **Colors**: Primary, Secondary, Text colors
   - **Assets**: Upload logo, favicon, banner
3. Click "Create"

### Step 3: View Organizations

1. Click "View Organizations" in the sidebar
2. You'll see a table with all organizations
3. Actions available:
   - **Edit**: Modify organization details
   - **Delete**: Remove organization
   - **Generate Theme**: Create and download ZIP package

### Step 4: Generate Theme ZIP

1. In the Organizations List, click "Generate" button
2. A ZIP file will be automatically downloaded
3. The ZIP contains:
   - `config.json`: Theme configuration
   - `assets/`: Folder with logo, favicon, banner

---

## ZIP Package Structure

```
theme_<organization_name>.zip
├── config.json
└── assets/
    ├── logo.png (or .jpg, .svg)
    ├── favicon.ico (or .png)
    └── banner.jpg (or .png)
```

### config.json Example

```json
{
  "theme_name": "Professional Theme",
  "app": {
    "title": "My Application",
    "browser_title": "My App"
  },
  "colors": {
    "primary": "#004F9E",
    "secondary": "#D3E3F5",
    "text": "#ffffff"
  },
  "font_family": "Inter, sans-serif",
  "assets": {
    "logo": "assets/logo.png",
    "favicon": "assets/favicon.ico",
    "banner": "assets/banner.jpg"
  },
  "version": "1.0.0"
}
```

---

## API Endpoints

### Authentication

**POST** `/api/auth/login/`
- Body: `{ "username": "admin", "password": "password" }`
- Returns: JWT tokens and user info

**POST** `/api/auth/refresh/`
- Body: `{ "refresh": "refresh_token" }`
- Returns: New access token

### Organizations

**GET** `/api/organizations/`
- Returns: List of all organizations

**POST** `/api/organizations/`
- Body: FormData with organization details
- Returns: Created organization

**GET** `/api/organizations/{id}/`
- Returns: Organization details

**PUT** `/api/organizations/{id}/`
- Body: FormData with updated details
- Returns: Updated organization

**DELETE** `/api/organizations/{id}/`
- Returns: 204 No Content

**POST** `/api/organizations/{id}/generate-theme/`
- Returns: ZIP file download

---

## Production Deployment

### Step 1: Update Environment Variables

Update `backend/.env` for production:

```env
SECRET_KEY=<generate-strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Step 2: Build Frontend for Production

```bash
npm run build
```

### Step 3: Deploy Backend

```bash
cd backend
docker-compose -f docker-compose.yml up -d
```

### Step 4: Serve Frontend

Serve the `dist/` folder using:
- Nginx
- Apache
- Any static file server

---

## Troubleshooting

### Backend Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs db
docker-compose logs backend
```

**Migrations Not Applied**
```bash
docker-compose exec backend python manage.py migrate
```

**Static Files Not Loading**
```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

### Frontend Issues

**API Connection Error**
- Ensure backend is running on http://localhost:8000
- Check CORS settings in `backend/dashboard/settings.py`
- Verify `CORS_ALLOWED_ORIGINS` includes frontend URL

**Authentication Issues**
- Clear browser localStorage
- Check if user has `is_super_admin=True`
- Verify JWT tokens are valid

---

## Development Commands

### Backend

```bash
# Create migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access Django shell
docker-compose exec backend python manage.py shell

# Run tests
docker-compose exec backend python manage.py test
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint code
npm run lint
```

---

## Database Models

### User
- Extends Django's AbstractUser
- Additional field: `is_super_admin` (Boolean)

### Organization
- `name`: CharField
- `description`: TextField
- `app_title`: CharField
- `browser_title`: CharField
- `primary_color`: CharField (hex color)
- `secondary_color`: CharField (hex color)
- `text_color`: CharField (hex color)
- `font_family`: CharField
- `logo`: ImageField
- `favicon`: ImageField
- `banner`: ImageField
- `config_json`: JSONField
- `created_at`: DateTimeField
- `updated_at`: DateTimeField

### ThemeHistory
- `organization`: ForeignKey to Organization
- `zip_file`: FileField
- `version`: CharField
- `created_at`: DateTimeField

---

## Security Considerations

1. **JWT Authentication**: All API endpoints require valid JWT tokens
2. **Super Admin Only**: Only users with `is_super_admin=True` can access the system
3. **File Validation**: Uploaded files are validated by extension
4. **CORS**: Configured to allow only specified origins
5. **SQL Injection**: Protected by Django ORM
6. **XSS**: Protected by React's default escaping
7. **CSRF**: Protected by Django's CSRF middleware

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Django logs: `docker-compose logs backend`
3. Review PostgreSQL logs: `docker-compose logs db`
4. Check browser console for frontend errors

---

## License

This project is licensed under the MIT License.
