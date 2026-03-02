# Generic Super Admin Theme Manager

A production-ready, enterprise-grade application for managing organizations and generating theme ZIP packages that control application UI branding.

## Features

- **Organization Management**: Create, edit, and delete organizations
- **Theme Configuration**: Customize colors, fonts, titles, and branding assets
- **ZIP Generation**: Automatically generate theme packages with config.json and assets
- **JWT Authentication**: Secure authentication with JWT tokens
- **Super Admin Access**: Role-based access control for super administrators
- **Image Upload**: Upload and preview logos, favicons, and banners
- **Material UI**: Modern, responsive interface with Material Design
- **Docker Support**: Fully containerized for easy deployment

## Tech Stack

### Backend
- Django 4.2 (LTS)
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Pillow for image processing
- Gunicorn for production
- Docker + Docker Compose

### Frontend
- React 18
- TypeScript
- Material UI (MUI)
- SCSS
- React Hook Form
- Axios
- Vite

## Quick Start

### 1. Start Backend

```bash
cd backend
cp .env.example .env
docker-compose up --build
```

### 2. Create Super Admin

```bash
docker-compose exec backend python manage.py createsuperuser
```

Then enable super admin access in Django admin (http://localhost:8000/admin/)

### 3. Start Frontend

```bash
npm install
npm run dev
```

### 4. Access Application

Open http://localhost:5173 and login with your super admin credentials.

## Documentation

See [SETUP.md](./SETUP.md) for detailed setup and deployment instructions.

## Generated ZIP Structure

```
theme_<organization>.zip
├── config.json
└── assets/
    ├── logo.png
    ├── favicon.ico
    └── banner.jpg
```

## API Endpoints

- `POST /api/auth/login/` - Login and get JWT tokens
- `GET /api/organizations/` - List all organizations
- `POST /api/organizations/` - Create organization
- `PUT /api/organizations/{id}/` - Update organization
- `DELETE /api/organizations/{id}/` - Delete organization
- `POST /api/organizations/{id}/generate-theme/` - Generate and download ZIP

## Screenshots

### Dashboard
The dashboard provides an overview of total organizations, theme packages, and active themes.

### Organizations List
View all organizations in a table with actions to edit, delete, or generate theme packages.

### Add/Edit Organization
Form to create or update organization details including branding colors, fonts, and asset uploads.

## Security

- JWT-based authentication
- Super admin role verification
- File type validation
- CORS protection
- SQL injection protection via Django ORM
- XSS protection via React

## License

MIT License - See LICENSE file for details
