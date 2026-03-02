import React, { useState } from 'react';
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
import './License.scss';

interface LicenseFormData {
  vm_ip: string;
  expiry_date: string;
}

const License: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LicenseFormData>();

  const onSubmit = async (data: LicenseFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/license/generate/', data, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `license_${data.vm_ip}_${data.expiry_date}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess('License generated and downloaded successfully!');
      reset();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to generate license');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="license-page">
      <Typography variant="h4" className="page-title">
        License Generator
      </Typography>
      <Typography variant="body1" className="page-description">
        Generate a cryptographically signed license for client deployment. The license is bound to a specific VM ID and expiry date.
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
                label="VM ID / IP Address"
                {...register('vm_ip', {
                  required: 'VM IP is required',
                  minLength: {
                    value: 3,
                    message: 'VM IP must be at least 3 characters'
                  }
                })}
                error={!!errors.vm_ip}
                helperText={errors.vm_ip?.message}
                placeholder="10.1.1.111 or unique-vm-id"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                {...register('expiry_date', {
                  required: 'Expiry date is required',
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate >= today || 'Expiry date must be today or in the future';
                  }
                })}
                error={!!errors.expiry_date}
                helperText={errors.expiry_date?.message}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box className="action-box">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  className="generate-button"
                  size="large"
                >
                  {loading ? 'Generating...' : 'Generate License'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper className="info-paper">
        <Typography variant="h6" gutterBottom>
          How It Works
        </Typography>
        <Box component="ol" sx={{ pl: 2, mt: 1 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
            <strong>Generate License:</strong> Enter the client's VM ID and expiry date, then click "Generate License"
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
            <strong>Download ZIP:</strong> A ZIP file will be downloaded containing:
            <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
              <Typography component="li" variant="body2" sx={{ fontSize: '0.875rem' }}>
                <strong>license.json</strong> - Contains vm_id, expiry date, and cryptographic signature
              </Typography>
              <Typography component="li" variant="body2" sx={{ fontSize: '0.875rem' }}>
                <strong>public_key.pem</strong> - RSA public key for signature verification
              </Typography>
            </Box>
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
            <strong>Deploy:</strong> Send both files to the client and have them upload via their admin panel
          </Typography>
          <Typography component="li" variant="body2">
            <strong>Validation:</strong> The client's system will automatically verify the license signature and check VM ID match and expiry date
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default License;
