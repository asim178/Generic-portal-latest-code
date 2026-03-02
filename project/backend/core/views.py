import os
import zipfile
import json
import hashlib
import base64
from io import BytesIO
from datetime import datetime
from django.http import HttpResponse
from django.core.files.base import ContentFile
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Organization, ThemeHistory, License, MasterKey
from .serializers import OrganizationSerializer, ThemeHistorySerializer, LicenseSerializer
from .permissions import IsSuperAdmin


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            from .models import User
            try:
                user = User.objects.get(username=request.data.get('username'))
                response.data['user'] = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_super_admin': user.is_super_admin
                }
            except User.DoesNotExist:
                pass
        return response


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsSuperAdmin]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def generate_theme(self, request, pk=None):
        organization = self.get_object()

        config_data = {
            "theme_name": f"{organization.name} Theme",
            "app": {
                "title": organization.app_title,
                "browser_title": organization.app_title
            },
            "colors": {
                "primary": organization.primary_color,
                "secondary": organization.secondary_color,
                "text": organization.text_color
            },
            "font_family": "Arial, sans-serif",
            "assets": {},
            "version": "1.0.0"
        }

        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            if organization.logo and organization.logo.name:
                try:
                    with organization.logo.open('rb') as logo_file:
                        logo_content = logo_file.read()
                    logo_ext = os.path.splitext(organization.logo.name)[1]
                    asset_name = f'assets/logo{logo_ext}'
                    zip_file.writestr(asset_name, logo_content)
                    config_data['assets']['logo'] = asset_name
                except Exception as e:
                    print(f"Error adding logo: {e}")
                    import traceback
                    traceback.print_exc()

            if organization.favicon and organization.favicon.name:
                try:
                    with organization.favicon.open('rb') as favicon_file:
                        favicon_content = favicon_file.read()
                    favicon_ext = os.path.splitext(organization.favicon.name)[1]
                    asset_name = f'assets/favicon{favicon_ext}'
                    zip_file.writestr(asset_name, favicon_content)
                    config_data['assets']['favicon'] = asset_name
                except Exception as e:
                    print(f"Error adding favicon: {e}")
                    import traceback
                    traceback.print_exc()

            if organization.banner and organization.banner.name:
                try:
                    with organization.banner.open('rb') as banner_file:
                        banner_content = banner_file.read()
                    banner_ext = os.path.splitext(organization.banner.name)[1]
                    asset_name = f'assets/banner{banner_ext}'
                    zip_file.writestr(asset_name, banner_content)
                    config_data['assets']['banner'] = asset_name
                except Exception as e:
                    print(f"Error adding banner: {e}")
                    import traceback
                    traceback.print_exc()

            if organization.basket_image and organization.basket_image.name:
                try:
                    with organization.basket_image.open('rb') as basket_file:
                        basket_content = basket_file.read()
                    basket_ext = os.path.splitext(organization.basket_image.name)[1]
                    asset_name = f'assets/basket_image{basket_ext}'
                    zip_file.writestr(asset_name, basket_content)
                    config_data['assets']['basket_image'] = asset_name
                except Exception as e:
                    print(f"Error adding basket_image: {e}")
                    import traceback
                    traceback.print_exc()

            zip_file.writestr('config.json', json.dumps(config_data, indent=2))

        organization.config_json = config_data
        organization.save()

        zip_buffer.seek(0)
        filename = f"theme_{organization.name.replace(' ', '_').lower()}.zip"

        theme_history = ThemeHistory.objects.create(
            organization=organization,
            version="1.0.0"
        )
        theme_history.zip_file.save(filename, ContentFile(zip_buffer.read()), save=True)

        zip_buffer.seek(0)
        response = HttpResponse(zip_buffer.read(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


def get_or_create_master_key():
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.backends import default_backend

    master_key = MasterKey.objects.first()

    if not master_key:
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        public_key = private_key.public_key()

        private_key_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode()

        public_key_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode()

        master_key = MasterKey.objects.create(
            private_key_pem=private_key_pem,
            public_key_pem=public_key_pem
        )

    return master_key


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsSuperAdmin]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_organizations = Organization.objects.count()
        total_themes = ThemeHistory.objects.count()
        active_themes = Organization.objects.filter(config_json__isnull=False).count()

        return Response({
            'total_organizations': total_organizations,
            'total_themes': total_themes,
            'active_themes': active_themes
        })


class LicenseViewSet(viewsets.ModelViewSet):
    queryset = License.objects.all()
    serializer_class = LicenseSerializer
    permission_classes = [IsSuperAdmin]

    @action(detail=False, methods=['post'])
    def generate(self, request):
        vm_ip = request.data.get('vm_ip')
        expiry_date = request.data.get('expiry_date')

        if not vm_ip or not expiry_date:
            return Response(
                {'error': 'vm_ip and expiry_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            expiry_date_obj = datetime.strptime(expiry_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from cryptography.hazmat.primitives.asymmetric import padding
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.backends import default_backend

        master_key = get_or_create_master_key()

        private_key = serialization.load_pem_private_key(
            master_key.private_key_pem.encode(),
            password=None,
            backend=default_backend()
        )

        payload = {
            "vm_id": vm_ip,
            "expiry": expiry_date
        }

        payload_string = json.dumps(payload, separators=(",", ":"))
        signature = private_key.sign(
            payload_string.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        signature_hex = signature.hex()

        license_key = hashlib.sha256(payload_string.encode()).hexdigest()

        license_obj = License.objects.create(
            vm_ip=vm_ip,
            expiry_date=expiry_date_obj,
            license_key=license_key
        )

        license_json = {
            "vm_id": vm_ip,
            "expiry": expiry_date,
            "signature": signature_hex
        }

        public_key_pem = master_key.public_key_pem

        zip_buffer = BytesIO()
        zip_file = zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_STORED)
        zip_file.writestr('license.json', json.dumps(license_json, indent=2))
        zip_file.writestr('public_key.pem', public_key_pem)
        zip_file.close()

        filename = f"license_{vm_ip.replace('.', '_')}_{expiry_date}.zip"

        response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
