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
 import UserDashboard from './components/user/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
           <Route path="/user-dashboard" element={<UserDashboard />} /> 
          
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/reservations" element={<VoirReservations />} />
          <Route path ="/user/destinations" element={<VoirDestinations/>} />
          <Route path="/user/favoris" element={<MesFavoris />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/destinations" element={<DestinationsAdmin />} />
        </Route>

        <Route path="*" element="/" />
      </Routes>
    </Router>
  );
}

export default App;