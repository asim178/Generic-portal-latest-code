from rest_framework import serializers
from PIL import Image
from .models import User, Organization, ThemeHistory, License


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_super_admin']
        read_only_fields = ['id']


class OrganizationSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    banner_url = serializers.SerializerMethodField()
    basket_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            'id',
            'name',
            'app_title',
            'primary_color',
            'secondary_color',
            'text_color',
            'logo',
            'logo_url',
            'favicon',
            'favicon_url',
            'banner',
            'banner_url',
            'basket_image',
            'basket_image_url',
            'config_json',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'config_json']

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
        return None

    def get_favicon_url(self, obj):
        if obj.favicon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.favicon.url)
        return None

    def get_banner_url(self, obj):
        if obj.banner:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.banner.url)
        return None

    def get_basket_image_url(self, obj):
        if obj.basket_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.basket_image.url)
        return None

    def validate_logo(self, value):
        if value:
            if value.size > 20 * 1024:
                raise serializers.ValidationError("Logo file size must not exceed 20KB")

            try:
                img = Image.open(value)
                width, height = img.size
                if width > 150 or height > 80:
                    raise serializers.ValidationError("Logo dimensions must not exceed 150x80 pixels")
            except Exception as e:
                raise serializers.ValidationError(f"Invalid image file: {str(e)}")

            value.seek(0)
        return value

    def validate_favicon(self, value):
        if value:
            if value.size > 5 * 1024:
                raise serializers.ValidationError("Favicon file size must not exceed 5KB")

            try:
                img = Image.open(value)
                width, height = img.size
                if not ((width == 16 and height == 16) or (width == 32 and height == 32)):
                    raise serializers.ValidationError("Favicon must be either 16x16 or 32x32 pixels")
            except Exception as e:
                raise serializers.ValidationError(f"Invalid image file: {str(e)}")

            value.seek(0)
        return value

    def validate_banner(self, value):
        if value:
            if value.size > 30 * 1024:
                raise serializers.ValidationError("Banner file size must not exceed 30KB")

            try:
                img = Image.open(value)
                width, height = img.size
                if width > 1000 or height > 500:
                    raise serializers.ValidationError("Banner dimensions must not exceed 1000x500 pixels")
            except Exception as e:
                raise serializers.ValidationError(f"Invalid image file: {str(e)}")

            value.seek(0)
        return value

    def validate_basket_image(self, value):
        if value:
            if value.size > 10 * 1024:
                raise serializers.ValidationError("Basket image file size must not exceed 10KB")

            try:
                img = Image.open(value)
                width, height = img.size
                if width > 100 or height > 100:
                    raise serializers.ValidationError("Basket image dimensions must not exceed 100x100 pixels")

                if img.format != 'PNG':
                    raise serializers.ValidationError("Basket image must be in PNG format")
            except Exception as e:
                raise serializers.ValidationError(f"Invalid image file: {str(e)}")

            value.seek(0)
        return value


class ThemeHistorySerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    zip_file_url = serializers.SerializerMethodField()

    class Meta:
        model = ThemeHistory
        fields = [
            'id',
            'organization',
            'organization_name',
            'zip_file',
            'zip_file_url',
            'version',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_zip_file_url(self, obj):
        if obj.zip_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.zip_file.url)
        return None


class LicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = License
        fields = [
            'id',
            'vm_ip',
            'expiry_date',
            'license_key',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'license_key', 'created_at', 'updated_at']
