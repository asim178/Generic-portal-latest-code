# User Guide - Generic Super Admin Theme Manager

Complete guide for using the Generic Super Admin Theme Manager application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Managing Organizations](#managing-organizations)
4. [Generating Theme Packages](#generating-theme-packages)
5. [Using Theme Packages](#using-theme-packages)
6. [Best Practices](#best-practices)

---

## Getting Started

### Login

1. Navigate to the application URL (e.g., http://localhost:5173)
2. You'll see the login screen with the Admin Super Panel logo
3. Enter your username and password
4. Click "Sign In"

**Note**: Only users with super admin privileges can access the system.

### First Time Setup

If this is your first time using the application:
1. Your administrator should have created a super admin account for you
2. Log in with the provided credentials
3. You'll be redirected to the Dashboard

---

## Dashboard

The Dashboard is your home screen after logging in.

### Layout

**Left Sidebar:**
- Logo and "Admin Panel" text at the top
- Menu items:
  - Dashboard
  - Add Organization
  - View Organizations

**Top Bar:**
- "Admin Super Panel" title in the center
- Your username on the right
- Logout button on the right

**Main Content:**
- Statistics cards showing:
  - Total Organizations
  - Theme Packages
  - Active Themes
- Welcome message with application description

### Navigation

Click any menu item in the left sidebar to navigate:
- **Dashboard**: View statistics and overview
- **Add Organization**: Create a new organization
- **View Organizations**: See all organizations in a table

---

## Managing Organizations

### Creating a New Organization

1. Click **"Add Organization"** in the sidebar
2. Fill in the required information:

#### Basic Information
- **Organization Name** (required): Name of the organization
- **Description**: Optional description of the organization
- **Application Title** (required): Title shown in the application
- **Browser Title** (required): Title shown in the browser tab

#### Styling
- **Font Family**: CSS font family (default: Inter, sans-serif)
- **Primary Color**: Main brand color (click color picker or enter hex code)
- **Secondary Color**: Secondary brand color
- **Text Color**: Text color for UI elements

#### Assets
- **Logo**: Upload organization logo (PNG, JPG, SVG)
- **Favicon**: Upload favicon (ICO, PNG)
- **Banner**: Upload banner image (PNG, JPG)

3. Click **"Create"** to save the organization

**Tips:**
- Preview images appear below upload buttons
- Color pickers provide visual selection
- All color fields accept hex codes (e.g., #004F9E)

### Viewing Organizations

1. Click **"View Organizations"** in the sidebar
2. You'll see a table with all organizations

#### Table Columns
- Name
- Description
- Application Title
- Primary Color (shown as colored chip)
- Secondary Color (shown as colored chip)
- Text Color (shown as colored chip)
- Actions (Edit and Delete buttons)
- Generate Theme (Generate button)

### Editing an Organization

1. In the Organizations List, click the **Edit icon** (pencil icon)
2. The form will load with existing data
3. Modify any fields you want to change
4. Click **"Update"** to save changes
5. Click **"Cancel"** to discard changes

### Deleting an Organization

1. In the Organizations List, click the **Delete icon** (trash icon)
2. Confirm the deletion in the popup dialog
3. The organization will be permanently removed

**Warning**: Deleting an organization cannot be undone!

---

## Generating Theme Packages

### What is a Theme Package?

A theme package is a ZIP file containing:
- **config.json**: Configuration file with all theme settings
- **assets/**: Folder with uploaded images (logo, favicon, banner)

This ZIP can be uploaded to other applications to instantly change their appearance.

### How to Generate

1. Go to **"View Organizations"**
2. Find the organization you want to generate a theme for
3. Click the **"Generate"** button in the Generate Theme column
4. The ZIP file will automatically download to your computer

**File Naming:**
- The file will be named: `theme_<organization_name>.zip`
- Example: `theme_acme_corporation.zip`

### What's Inside the ZIP

```
theme_acme_corporation.zip
├── config.json
└── assets/
    ├── logo.png
    ├── favicon.ico
    └── banner.jpg
```

#### config.json Structure

```json
{
  "theme_name": "ACME Corporation Theme",
  "app": {
    "title": "ACME Portal",
    "browser_title": "ACME Portal"
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

## Using Theme Packages

### In Other Applications

To use a generated theme package in another application:

1. Download the theme ZIP from this system
2. In the target application, navigate to the theme upload section
3. Upload the ZIP file
4. The application will:
   - Read the config.json
   - Extract assets to the appropriate locations
   - Apply colors, fonts, and titles
   - Update the UI instantly

### Manual Integration

If manually integrating a theme:

1. Extract the ZIP file
2. Read `config.json` to get theme settings
3. Copy assets to your application's assets folder
4. Apply colors to your CSS/SCSS:
   ```css
   :root {
     --primary-color: #004F9E;
     --secondary-color: #D3E3F5;
     --text-color: #ffffff;
   }
   ```
5. Update application title and browser title
6. Replace favicon and logo references

---

## Best Practices

### Organization Names

- Use clear, descriptive names
- Avoid special characters
- Use proper capitalization
- Example: "ACME Corporation" not "acme_corp"

### Colors

**Primary Color:**
- Should be your main brand color
- Used for buttons, links, headers
- Ensure good contrast with text

**Secondary Color:**
- Should complement the primary color
- Used for backgrounds, borders
- Typically lighter than primary

**Text Color:**
- Should be readable on your backgrounds
- White (#ffffff) works well on dark primaries
- Dark colors (#333333) work well on light backgrounds

### Images

**Logo:**
- Recommended size: 200x80 pixels or similar aspect ratio
- Use PNG for transparency
- Keep file size under 500KB
- Use SVG when possible for scalability

**Favicon:**
- Size: 16x16 or 32x32 pixels
- Use .ico format for best compatibility
- Keep it simple and recognizable

**Banner:**
- Recommended size: 1920x400 pixels
- Use JPG for photos, PNG for graphics
- Keep file size under 2MB
- Ensure important content is centered

### Font Family

- Use web-safe fonts or Google Fonts
- Format: `'Primary Font', 'Fallback Font', sans-serif`
- Examples:
  - `'Roboto', sans-serif`
  - `'Open Sans', 'Helvetica', sans-serif`
  - `'Montserrat', 'Arial', sans-serif`

### Descriptions

- Provide clear, concise descriptions
- Mention the purpose or department
- Include any special notes
- Example: "Corporate branding for ACME Corp headquarters"

---

## Common Tasks

### Updating a Logo

1. Go to View Organizations
2. Click Edit on the organization
3. Click "Upload Logo" button
4. Select new logo file
5. Preview will appear below
6. Click "Update" to save

### Changing Colors

1. Go to View Organizations
2. Click Edit on the organization
3. Click on any color picker
4. Select new color or enter hex code
5. Click "Update" to save
6. Generate new theme to get updated ZIP

### Regenerating a Theme

After making any changes to an organization:
1. Go to View Organizations
2. Click "Generate" for the updated organization
3. New ZIP will download with current settings

---

## Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit forms
- **Escape**: Cancel/close dialogs

---

## Tips and Tricks

1. **Preview Colors**: Use the color chips in the table to quickly see all organization colors
2. **Bulk Updates**: Edit organizations one by one and generate themes as needed
3. **Consistent Naming**: Use similar naming conventions across all organizations
4. **Test Themes**: Generate and test themes in target applications before deploying
5. **Keep Backups**: Download and save theme ZIPs for version control

---

## Troubleshooting

### Can't Login

- Verify username and password
- Ensure your account has super admin privileges
- Contact your system administrator

### Upload Failed

- Check file size (max 10MB)
- Verify file format (PNG, JPG, SVG for images)
- Try a different browser

### ZIP Not Downloading

- Check browser's download settings
- Disable popup blockers
- Try a different browser

### Colors Not Showing

- Use hex format: #RRGGBB
- Don't use color names (e.g., "red")
- Ensure 6 characters after #

---

## Support

For assistance:
1. Check this guide first
2. Review the SETUP.md for technical issues
3. Contact your system administrator
4. Check the application logs if you have access

---

## Glossary

**Organization**: A company, department, or entity with its own branding

**Theme Package**: ZIP file containing configuration and assets

**config.json**: JSON file with theme settings

**Primary Color**: Main brand color used throughout the application

**Secondary Color**: Supporting color that complements the primary

**Hex Code**: 6-character color code (e.g., #004F9E)

**Assets**: Images and files used in the theme (logo, favicon, banner)

**Super Admin**: User with full access to the theme manager system
