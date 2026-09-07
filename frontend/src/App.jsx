import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* العرض المباشر فـ الصفحة الرئيسية */}
        <Route path="/" element={<Dashboard />} />
        
        {/* إذا بغيتيها كـ مسار /dashboard حتى هي */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* صفحات التسجيل والتسجيل الدخول */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;