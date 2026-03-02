import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import './OrganizationForm.scss';

interface OrganizationFormData {
  name: string;
  app_title: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  logo?: FileList;
  favicon?: FileList;
  banner?: FileList;
  basket_image?: FileList;
}

interface OrganizationFormProps {
  organizationId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organizationId,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [basketImagePreview, setBasketImagePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [basketImageFile, setBasketImageFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<OrganizationFormData>({
    defaultValues: {
      name: '',
      app_title: 'My Application',
      primary_color: '#004F9E',
      secondary_color: '#D3E3F5',
      text_color: '#ffffff',
    },
  });

  const primaryColor = watch('primary_color');
  const secondaryColor = watch('secondary_color');
  const textColor = watch('text_color');

  useEffect(() => {
    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  const fetchOrganization = async () => {
    try {
      const response = await api.get(`/organizations/${organizationId}/`);
      const org = response.data;

      Object.keys(org).forEach((key) => {
        if (key !== 'logo' && key !== 'favicon' && key !== 'banner' && key !== 'basket_image') {
          setValue(key as any, org[key]);
        }
      });

      if (org.logo_url) setLogoPreview(org.logo_url);
      if (org.favicon_url) setFaviconPreview(org.favicon_url);
      if (org.banner_url) setBannerPreview(org.banner_url);
      if (org.basket_image_url) setBasketImagePreview(org.basket_image_url);
    } catch (error) {
      console.error('Error fetching organization:', error);
      setError('Failed to load organization data');
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'favicon' | 'banner' | 'basket_image'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'logo') setLogoFile(file);
      if (type === 'favicon') setFaviconFile(file);
      if (type === 'banner') setBannerFile(file);
      if (type === 'basket_image') setBasketImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'logo') setLogoPreview(result);
        if (type === 'favicon') setFaviconPreview(result);
        if (type === 'banner') setBannerPreview(result);
        if (type === 'basket_image') setBasketImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: OrganizationFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== 'logo' && key !== 'favicon' && key !== 'banner' && key !== 'basket_image') {
          formData.append(key, (data as any)[key]);
        }
      });

      if (logoFile) {
        formData.append('logo', logoFile);
      }
      if (faviconFile) {
        formData.append('favicon', faviconFile);
      }
      if (bannerFile) {
        formData.append('banner', bannerFile);
      }
      if (basketImageFile) {
        formData.append('basket_image', basketImageFile);
      }

      if (organizationId) {
        await api.put(`/organizations/${organizationId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Organization updated successfully!');
      } else {
        await api.post('/organizations/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Organization created successfully!');
      }

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      let errorMessage = 'Failed to save organization';

      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            errorMessage = `${firstKey}: ${errorData[firstKey][0]}`;
          } else if (firstKey) {
            errorMessage = `${firstKey}: ${errorData[firstKey]}`;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Save organization error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="organization-form">
      <Typography variant="h5" className="form-title">
        {organizationId ? 'Edit Organization' : 'Add New Organization'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper className="form-paper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Organization Name"
                {...register('name', { required: true })}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Application Title"
                {...register('app_title', { required: true })}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Primary Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setValue('primary_color', e.target.value)}
                    style={{ width: 60, height: 40, border: 'none', cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={primaryColor}
                    onChange={(e) => setValue('primary_color', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Secondary Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setValue('secondary_color', e.target.value)}
                    style={{ width: 60, height: 40, border: 'none', cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={secondaryColor}
                    onChange={(e) => setValue('secondary_color', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Text Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setValue('text_color', e.target.value)}
                    style={{ width: 60, height: 40, border: 'none', cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={textColor}
                    onChange={(e) => setValue('text_color', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Logo (max 150x80, max 20KB)
                </Typography>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Logo
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/jpg,image/jpeg,image/svg+xml"
                    onChange={(e) => handleFileChange(e, 'logo')}
                  />
                </Button>
                {logoPreview && (
                  <Box className="image-preview">
                    <img src={logoPreview} alt="Logo preview" />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Favicon (32x32 or 16x16, max 5KB)
                </Typography>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Favicon
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/x-icon"
                    onChange={(e) => handleFileChange(e, 'favicon')}
                  />
                </Button>
                {faviconPreview && (
                  <Box className="image-preview">
                    <img src={faviconPreview} alt="Favicon preview" />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Home Page Banner (max 1000x500, max 30KB)
                </Typography>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Banner
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/jpg,image/jpeg"
                    onChange={(e) => handleFileChange(e, 'banner')}
                  />
                </Button>
                {bannerPreview && (
                  <Box className="image-preview">
                    <img src={bannerPreview} alt="Banner preview" />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Basket Image (max 100x100, max 10KB, PNG)
                </Typography>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Basket Image
                  <input
                    type="file"
                    hidden
                    accept="image/png"
                    onChange={(e) => handleFileChange(e, 'basket_image')}
                  />
                </Button>
                {basketImagePreview && (
                  <Box className="image-preview">
                    <img src={basketImagePreview} alt="Basket preview" />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? 'Saving...' : organizationId ? 'Update' : 'Create'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default OrganizationForm;