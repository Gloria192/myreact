import React, { useState } from 'react';
import { PassengerDashboard } from './PassengerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { AdminLogin } from './AdminLogin';

interface DashboardProps {
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = (success: boolean) => {
    setIsAdminLoggedIn(success);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
    if (onLogout) onLogout();
  };

  if (showAdmin && !isAdminLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (showAdmin && isAdminLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <PassengerDashboard onSwitchToAdmin={() => setShowAdmin(true)} />;
};