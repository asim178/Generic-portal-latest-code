import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Building2, Package, TrendingUp } from 'lucide-react';
import api from '../services/api';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalThemes: 0,
    activeThemes: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats/');
      setStats({
        totalOrganizations: response.data.total_organizations,
        totalThemes: response.data.total_themes,
        activeThemes: response.data.active_themes,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Organizations',
      value: stats.totalOrganizations,
      icon: <Building2 size={32} />,
      color: '#2563eb',
      bg: '#dbeafe',
    },
    {
      title: 'Theme Packages',
      value: stats.totalThemes,
      icon: <Package size={32} />,
      color: '#7c3aed',
      bg: '#ede9fe',
    },
    {
      title: 'Active Themes',
      value: stats.activeThemes,
      icon: <TrendingUp size={32} />,
      color: '#059669',
      bg: '#d1fae5',
    },
  ];

  return (
    <Box className="dashboard">
      <Typography variant="h5" className="dashboard-title">
        Dashboard Overview
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {statCards.map((card) => (
          <Box key={card.title} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card className="stat-card">
              <CardContent>
                <Box className="stat-header">
                  <Box
                    className="stat-icon"
                    sx={{ backgroundColor: card.bg, color: card.color }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h3" className="stat-value">
                  {card.value}
                </Typography>
                <Typography variant="body2" className="stat-title">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box className="welcome-section">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e3a5f' }}>
          Welcome to Admin Super Panel
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.7 }}>
          Manage organizations and generate theme packages that control application UI branding.
          Each generated ZIP contains configuration files and assets that can be uploaded to other
          applications to instantly override their appearance.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
