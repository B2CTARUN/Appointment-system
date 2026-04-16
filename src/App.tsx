import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/layout/MainLayout';
import Timetable from './pages/Timetable';
import Appointments from './pages/Appointments';

import AdminUsers from './pages/AdminUsers';
import AdminSchedule from './pages/AdminSchedule';

import Landing from './pages/Landing';

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      {!user ? (
        <>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        /* Private Routes */
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="appointments" element={<Appointments />} />
          
          {/* Admin Routes */}
          {user.role === 'admin' && (
            <>
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/schedule" element={<AdminSchedule />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
