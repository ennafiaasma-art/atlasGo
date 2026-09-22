import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import AdminDashboard from './components/admin/AdminDashboard'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import DestinationsAdmin from './components/admin/DestinationsAdmin';
import VoirDestinations from './components/user/VoirDestinations';

import MesFavoris from './components/user/MesFavoris';
import VoirReservations from './components/user/VoirReservations';
import Profile from './components/user/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* user routes */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/destinations/:id" element={<VoirDestinations />} />
          
          <Route path="/user/MesFavoris" element={<MesFavoris />} />
          <Route path="/user/VoirReservations" element={<VoirReservations />} />
          <Route path="/user/Profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/destinations" element={<DestinationsAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;