import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './TopBar.scss';

const TopBar: React.FC = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <Box className="topbar">
      <Typography variant="h5" className="topbar-title">
        Admin Super Panel
      </Typography>
      <Box className="topbar-right">
        <Typography variant="body2" className="user-name">
          {user?.username}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LogOut size={18} />}
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default TopBar;
