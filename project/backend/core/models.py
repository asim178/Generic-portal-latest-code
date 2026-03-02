from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator


class User(AbstractUser):
    is_super_admin = models.BooleanField(default=False)

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username


class Organization(models.Model):
    name = models.CharField(max_length=255)
    app_title = models.CharField(max_length=255, default='My Application')

    primary_color = models.CharField(max_length=7, default='#004F9E')
    secondary_color = models.CharField(max_length=7, default='#D3E3F5')
    text_color = models.CharField(max_length=7, default='#ffffff')

    logo = models.ImageField(
        upload_to='organizations/logos/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['png', 'jpg', 'jpeg', 'svg'])]
    )
    favicon = models.ImageField(
        upload_to='organizations/favicons/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['ico', 'png'])]
    )
    banner = models.ImageField(
        upload_to='organizations/banners/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['png', 'jpg', 'jpeg'])]
    )
    basket_image = models.ImageField(
        upload_to='organizations/basket_images/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['png'])]
    )

    config_json = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'organizations'
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class ThemeHistory(models.Model):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='theme_history'
    )
    zip_file = models.FileField(
        upload_to='theme_packages/',
        validators=[FileExtensionValidator(allowed_extensions=['zip'])]
    )
    version = models.CharField(max_length=50, default='1.0.0')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'theme_history'
        verbose_name = 'Theme History'
        verbose_name_plural = 'Theme Histories'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.organization.name} - v{self.version} - {self.created_at}"


class MasterKey(models.Model):
    private_key_pem = models.TextField()
    public_key_pem = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'master_keys'
        verbose_name = 'Master Key'
        verbose_name_plural = 'Master Keys'

    def __str__(self):
        return f"Master Key - Created: {self.created_at}"


class License(models.Model):
    vm_ip = models.CharField(max_length=255)
    expiry_date = models.DateField()
    license_key = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'licenses'
        verbose_name = 'License'
        verbose_name_plural = 'Licenses'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.vm_ip} - Expires: {self.expiry_date}"
