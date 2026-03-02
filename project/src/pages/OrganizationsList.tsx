import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit, Trash2, Download } from 'lucide-react';
import api from '../services/api';
import './OrganizationsList.scss';

interface Organization {
  id: number;
  name: string;
  description: string;
  app_title: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
}

interface OrganizationsListProps {
  onAddClick: () => void;
  onEditClick: (org: Organization) => void;
}

const OrganizationsList: React.FC<OrganizationsListProps> = ({ onAddClick, onEditClick }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get('/organizations/');
      setOrganizations(response.data.results);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await api.delete(`/organizations/${id}/`);
        fetchOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };

  const handleGenerateTheme = async (id: number, name: string) => {
    try {
      const response = await api.post(
        `/organizations/${id}/generate_theme/`,
        {},
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `theme_${name.replace(/\s+/g, '_').toLowerCase()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating theme:', error);
    }
  };

  return (
    <Box className="organizations-list">
      <Box className="list-header">
        <Typography variant="h5" className="list-title">
          Organizations List
        </Typography>
        <Button
          variant="contained"
          className="add-button"
          onClick={onAddClick}
        >
          Add Organization
        </Button>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Application Title</TableCell>
              <TableCell>Primary Color</TableCell>
              <TableCell>Secondary Color</TableCell>
              <TableCell>Text Color</TableCell>
              <TableCell align="center">Actions</TableCell>
              <TableCell align="center">Generate Theme</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No organizations found. Click "Add Organization" to create one.
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.description || '-'}</TableCell>
                  <TableCell>{org.app_title}</TableCell>
                  <TableCell>
                    <Chip
                      label={org.primary_color}
                      sx={{
                        backgroundColor: org.primary_color,
                        color: '#fff',
                        fontWeight: 500,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={org.secondary_color}
                      sx={{
                        backgroundColor: org.secondary_color,
                        color: '#333',
                        fontWeight: 500,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={org.text_color}
                      sx={{
                        backgroundColor: org.text_color,
                        color: org.text_color === '#ffffff' ? '#333' : '#fff',
                        fontWeight: 500,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => onEditClick(org)}
                      className="action-button edit-button"
                    >
                      <Edit size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(org.id)}
                      className="action-button delete-button"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      startIcon={<Download size={18} />}
                      onClick={() => handleGenerateTheme(org.id, org.name)}
                      className="generate-button"
                      size="small"
                    >
                      Generate
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrganizationsList;
