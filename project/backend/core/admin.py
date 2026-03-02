from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Organization, ThemeHistory, License


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_super_admin', 'is_staff']
    list_filter = ['is_super_admin', 'is_staff', 'is_superuser']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('is_super_admin',)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('is_super_admin',)}),
    )


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'app_title', 'primary_color', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'description', 'app_title']
    readonly_fields = ['created_at', 'updated_at', 'config_json']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description')
        }),
        ('Application Settings', {
            'fields': ('app_title', 'browser_title')
        }),
        ('Branding Colors', {
            'fields': ('primary_color', 'secondary_color', 'text_color', 'font_family')
        }),
        ('Assets', {
            'fields': ('logo', 'favicon', 'banner')
        }),
        ('Configuration', {
            'fields': ('config_json',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ThemeHistory)
class ThemeHistoryAdmin(admin.ModelAdmin):
    list_display = ['organization', 'version', 'created_at']
    list_filter = ['created_at']
    search_fields = ['organization__name', 'version']
    readonly_fields = ['created_at']


@admin.register(License)
class LicenseAdmin(admin.ModelAdmin):
    list_display = ['vm_ip', 'expiry_date', 'created_at']
    list_filter = ['expiry_date', 'created_at']
    search_fields = ['vm_ip', 'license_key']
    readonly_fields = ['license_key', 'created_at', 'updated_at']
