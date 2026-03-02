import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrganizationsList from './pages/OrganizationsList';
import OrganizationForm from './pages/OrganizationForm';
import License from './pages/License';
import './App.scss';

const MainApp: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [editingOrg, setEditingOrg] = useState<any>(null);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Loading...
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setEditingOrg(null);
  };

  const handleAddSuccess = () => {
    setActiveMenu('view-organizations');
    setEditingOrg(null);
  };

  const handleEditClick = (org: any) => {
    setEditingOrg(org);
    setActiveMenu('add-organization');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-organization':
        return (
          <OrganizationForm
            organizationId={editingOrg?.id}
            onSuccess={handleAddSuccess}
            onCancel={() => setActiveMenu('view-organizations')}
          />
        );
      case 'view-organizations':
        return (
          <OrganizationsList
            onAddClick={() => {
              setEditingOrg(null);
              setActiveMenu('add-organization');
            }}
            onEditClick={handleEditClick}
          />
        );
      case 'license':
        return <License />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box className="app-container">
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      <Box className="main-content">
        <TopBar />
        <Box className="content-area">{renderContent()}</Box>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
