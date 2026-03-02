import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Add, List as ListIcon, VpnKey } from '@mui/icons-material';
import './Sidebar.scss';

interface SidebarProps {
  activeMenu: string;
  onMenuClick: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'add-organization', label: 'Add Organization', icon: <Add /> },
    { id: 'view-organizations', label: 'View Organizations', icon: <ListIcon /> },
    { id: 'license', label: 'License', icon: <VpnKey /> },
  ];

  return (
    <Box className="sidebar">
      <Box className="sidebar-logo">
        <Dashboard sx={{ fontSize: 40, color: '#fff' }} />
        <Box component="span" className="logo-text">Admin Panel</Box>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              className={activeMenu === item.id ? 'active' : ''}
              onClick={() => onMenuClick(item.id)}
            >
              <ListItemIcon sx={{ color: activeMenu === item.id ? '#fff' : '#b0b0b0', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  color: activeMenu === item.id ? '#fff' : '#b0b0b0',
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                    fontWeight: activeMenu === item.id ? 600 : 400
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
