import React, { useState } from 'react';
import { PassengerDashboard } from './PassengerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { AdminLogin } from './AdminLogin';
import '../styles/Dashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [userRole, setUserRole] = useState<'passenger' | 'admin'>('passenger');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const handleRoleSelect = (role: 'passenger' | 'admin') => {
    setUserRole(role);
    if (role === 'admin') {
      setIsAdminLoggedIn(false);
    }
  };

  const handleAdminLogin = (success: boolean) => {
    setIsAdminLoggedIn(success);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setUserRole('passenger');
    if (onLogout) {
      onLogout();
    }
  };

  if (userRole === 'passenger') {
    return <PassengerDashboard onSwitchToAdmin={() => handleRoleSelect('admin')} />;
  }

  if (userRole === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return null;
};
