
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import SupabaseConnectionStatus from './SupabaseConnectionStatus';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath={location.pathname} />
      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-6xl mx-auto">
          <SupabaseConnectionStatus />
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
